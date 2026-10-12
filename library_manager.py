"""SQLite-backed library catalog and circulation command-line app."""

from __future__ import annotations

import argparse
import sqlite3
import sys
from contextlib import contextmanager
from datetime import date
from pathlib import Path
from typing import Iterator


class LibraryError(ValueError):
    """Raised when a catalog or loan operation is invalid."""


def checked_date(value: str, field: str) -> str:
    try:
        parsed = date.fromisoformat(value)
    except (TypeError, ValueError) as exc:
        raise LibraryError(f"{field} must be a valid date in YYYY-MM-DD format.") from exc
    if parsed.isoformat() != value:
        raise LibraryError(f"{field} must use YYYY-MM-DD format.")
    return value


class Library:
    def __init__(self, database: str | Path = "library.db") -> None:
        self.database = str(database)
        with self._connect() as connection:
            connection.executescript(
                """CREATE TABLE IF NOT EXISTS books (
                       isbn TEXT PRIMARY KEY, title TEXT NOT NULL, author TEXT NOT NULL
                   );
                   CREATE TABLE IF NOT EXISTS borrowers (
                       id INTEGER PRIMARY KEY, name TEXT NOT NULL
                   );
                   CREATE TABLE IF NOT EXISTS loans (
                       id INTEGER PRIMARY KEY,
                       isbn TEXT NOT NULL REFERENCES books(isbn),
                       borrower_id INTEGER NOT NULL REFERENCES borrowers(id),
                       checkout_date TEXT NOT NULL,
                       due_date TEXT NOT NULL,
                       returned_date TEXT
                   );"""
            )

    @contextmanager
    def _connect(self) -> Iterator[sqlite3.Connection]:
        connection = sqlite3.connect(self.database)
        connection.execute("PRAGMA foreign_keys = ON")
        try:
            with connection:
                yield connection
        finally:
            connection.close()

    def add_book(self, isbn: str, title: str, author: str) -> None:
        isbn, title, author = isbn.strip(), title.strip(), author.strip()
        if not isbn or not title or not author:
            raise LibraryError("ISBN, title, and author cannot be empty.")
        try:
            with self._connect() as connection:
                connection.execute(
                    "INSERT INTO books (isbn, title, author) VALUES (?, ?, ?)",
                    (isbn, title, author),
                )
        except sqlite3.IntegrityError as exc:
            raise LibraryError(f"A book with ISBN {isbn} already exists.") from exc

    def add_borrower(self, name: str) -> int:
        name = name.strip()
        if not name:
            raise LibraryError("Borrower name cannot be empty.")
        with self._connect() as connection:
            cursor = connection.execute("INSERT INTO borrowers (name) VALUES (?)", (name,))
            return int(cursor.lastrowid)

    def checkout(
        self, isbn: str, borrower_id: int, due_date: str,
        checkout_date: str | None = None,
    ) -> int:
        isbn = isbn.strip()
        checked_out = checked_date(checkout_date or date.today().isoformat(), "Checkout date")
        due = checked_date(due_date, "Due date")
        if due < checked_out:
            raise LibraryError("Due date cannot be earlier than checkout date.")
        with self._connect() as connection:
            if connection.execute("SELECT 1 FROM books WHERE isbn = ?", (isbn,)).fetchone() is None:
                raise LibraryError(f"Unknown book ISBN: {isbn}.")
            if connection.execute(
                "SELECT 1 FROM borrowers WHERE id = ?", (borrower_id,)
            ).fetchone() is None:
                raise LibraryError(f"Unknown borrower ID: {borrower_id}.")
            active = connection.execute(
                "SELECT 1 FROM loans WHERE isbn = ? AND returned_date IS NULL", (isbn,)
            ).fetchone()
            if active:
                raise LibraryError(f"Book {isbn} is already checked out.")
            cursor = connection.execute(
                """INSERT INTO loans (isbn, borrower_id, checkout_date, due_date)
                   VALUES (?, ?, ?, ?)""",
                (isbn, borrower_id, checked_out, due),
            )
            return int(cursor.lastrowid)

    def return_book(self, loan_id: int, return_date: str | None = None) -> None:
        returned = checked_date(return_date or date.today().isoformat(), "Return date")
        with self._connect() as connection:
            loan = connection.execute(
                "SELECT checkout_date, returned_date FROM loans WHERE id = ?", (loan_id,)
            ).fetchone()
            if loan is None:
                raise LibraryError(f"Unknown loan ID: {loan_id}.")
            if loan[1] is not None:
                raise LibraryError(f"Loan {loan_id} has already been returned.")
            if returned < loan[0]:
                raise LibraryError("Return date cannot precede checkout date.")
            connection.execute(
                "UPDATE loans SET returned_date = ? WHERE id = ?", (returned, loan_id)
            )

    def loans(self, as_of: str | None = None, overdue_only: bool = False) -> list[dict[str, object]]:
        day = checked_date(as_of or date.today().isoformat(), "Report date")
        query = """SELECT loans.id, books.isbn, books.title, borrowers.name,
                          loans.checkout_date, loans.due_date, loans.returned_date
                   FROM loans JOIN books USING (isbn)
                   JOIN borrowers ON loans.borrower_id = borrowers.id"""
        parameters: tuple[str, ...] = ()
        if overdue_only:
            query += " WHERE loans.returned_date IS NULL AND loans.due_date < ?"
            parameters = (day,)
        query += " ORDER BY loans.due_date, loans.id"
        with self._connect() as connection:
            rows = connection.execute(query, parameters).fetchall()
        return [
            {
                "id": row[0], "isbn": row[1], "title": row[2], "borrower": row[3],
                "checkout_date": row[4], "due_date": row[5], "returned_date": row[6],
                "overdue": row[6] is None and row[5] < day,
            }
            for row in rows
        ]


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(description=__doc__)
    root.add_argument("--db", default="library.db", help="SQLite database path")
    commands = root.add_subparsers(dest="command", required=True)
    book = commands.add_parser("add-book")
    book.add_argument("--isbn", required=True)
    book.add_argument("--title", required=True)
    book.add_argument("--author", required=True)
    borrower = commands.add_parser("add-borrower")
    borrower.add_argument("--name", required=True)
    checkout = commands.add_parser("checkout")
    checkout.add_argument("--isbn", required=True)
    checkout.add_argument("--borrower-id", type=int, required=True)
    checkout.add_argument("--due-date", required=True)
    checkout.add_argument("--checkout-date")
    returning = commands.add_parser("return")
    returning.add_argument("--loan-id", type=int, required=True)
    returning.add_argument("--return-date")
    listing = commands.add_parser("list-loans")
    listing.add_argument("--as-of")
    overdue = commands.add_parser("overdue")
    overdue.add_argument("--as-of")
    return root


def main(argv: list[str] | None = None) -> int:
    args = parser().parse_args(argv)
    library = Library(args.db)
    try:
        if args.command == "add-book":
            library.add_book(args.isbn, args.title, args.author)
            print(f"Added book: {args.title}")
        elif args.command == "add-borrower":
            print(f"Added borrower #{library.add_borrower(args.name)}.")
        elif args.command == "checkout":
            loan_id = library.checkout(
                args.isbn, args.borrower_id, args.due_date, args.checkout_date
            )
            print(f"Checked out as loan #{loan_id}.")
        elif args.command == "return":
            library.return_book(args.loan_id, args.return_date)
            print(f"Returned loan #{args.loan_id}.")
        else:
            entries = library.loans(args.as_of, overdue_only=args.command == "overdue")
            if not entries:
                print("No loans found.")
            for loan in entries:
                state = "OVERDUE" if loan["overdue"] else (
                    f"returned {loan['returned_date']}" if loan["returned_date"] else "on loan"
                )
                print(
                    f"#{loan['id']} | {loan['title']} ({loan['isbn']}) | "
                    f"{loan['borrower']} | due {loan['due_date']} | {state}"
                )
    except (LibraryError, OSError, sqlite3.Error) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
