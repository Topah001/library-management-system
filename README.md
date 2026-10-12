# Library Management System

A Python 3.13 command-line library register backed by local SQLite. It tracks books, borrowers, active loans, returns, and overdue loans.

## Requirements

- Python 3.13 (standard library only)

## Run

```powershell
python library_manager.py add-book --isbn 9780000000001 --title "Example Book" --author "A. Writer"
python library_manager.py add-borrower --name "Alex Reader"
python library_manager.py checkout --isbn 9780000000001 --borrower-id 1 --due-date 2026-11-01
python library_manager.py list-loans
python library_manager.py overdue
python library_manager.py return --loan-id 1
```

The database defaults to `library.db` in the current directory; pass `--db path\to\file.db` before a command to select another file. Checkout and due dates use `YYYY-MM-DD`; checkout defaults to today. A book cannot have two active loans, unknown books/borrowers cannot be checked out, and due dates cannot precede checkout.

## Tests

```powershell
python -m unittest discover -s tests -v
```

The app is offline and stores its data locally. Database files are excluded from Git.
