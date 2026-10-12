import unittest
from pathlib import Path

from library_manager import Library, LibraryError


class LibraryTests(unittest.TestCase):
    def setUp(self):
        self.database = Path(__file__).with_name(".test_library.db")
        self.database.unlink(missing_ok=True)
        self.addCleanup(self.database.unlink, missing_ok=True)
        self.library = Library(self.database)
        self.library.add_book("ISBN-1", "A Book", "An Author")
        self.borrower = self.library.add_borrower("Reader")

    def test_checkout_and_return(self):
        loan_id = self.library.checkout(
            "ISBN-1", self.borrower, "2026-11-05", checkout_date="2026-10-01"
        )
        self.assertEqual(len(self.library.loans(as_of="2026-10-02")), 1)
        self.library.return_book(loan_id, "2026-10-10")
        self.assertEqual(self.library.loans(as_of="2026-11-10")[0]["returned_date"], "2026-10-10")
        self.assertEqual(self.library.loans("2026-11-10", overdue_only=True), [])

    def test_prevents_invalid_loans_and_duplicate_active_checkout(self):
        with self.assertRaisesRegex(LibraryError, "Unknown book"):
            self.library.checkout("missing", self.borrower, "2026-11-01")
        with self.assertRaisesRegex(LibraryError, "Unknown borrower"):
            self.library.checkout("ISBN-1", 999, "2026-11-01")
        with self.assertRaisesRegex(LibraryError, "earlier"):
            self.library.checkout("ISBN-1", self.borrower, "2026-09-30", "2026-10-01")
        self.library.checkout("ISBN-1", self.borrower, "2026-11-01", "2026-10-01")
        with self.assertRaisesRegex(LibraryError, "already checked out"):
            self.library.checkout("ISBN-1", self.borrower, "2026-11-03", "2026-10-02")

    def test_overdue_only_excludes_returned_and_due_today(self):
        past = self.library.checkout(
            "ISBN-1", self.borrower, "2026-10-01", checkout_date="2026-09-01"
        )
        self.library.add_book("ISBN-2", "Another Book", "Author")
        borrower2 = self.library.add_borrower("Second Reader")
        self.library.checkout("ISBN-2", borrower2, "2026-10-12", "2026-09-02")
        self.assertEqual(len(self.library.loans("2026-10-12", overdue_only=True)), 1)
        self.library.return_book(past, "2026-10-05")
        self.assertEqual(self.library.loans("2026-10-12", overdue_only=True), [])

    def test_duplicate_books_and_repeated_return_rejected(self):
        with self.assertRaises(LibraryError):
            self.library.add_book("ISBN-1", "Duplicate", "Author")
        loan_id = self.library.checkout("ISBN-1", self.borrower, "2026-11-01")
        self.library.return_book(loan_id, "2026-10-12")
        with self.assertRaisesRegex(LibraryError, "already been returned"):
            self.library.return_book(loan_id, "2026-10-13")


if __name__ == "__main__":
    unittest.main()
