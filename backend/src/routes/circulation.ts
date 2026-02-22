import express from 'express';
import { body, validationResult } from 'express-validator';
import Circulation from '../models/Circulation';
import Book from '../models/Book';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();
const LATE_FEE_PER_DAY = 1.0;
const MAX_RENEWALS = 2;
const BORROW_DAYS = 14;

// @route   POST /api/circulation/issue
// @desc    Issue a book to a member
// @access  Private
router.post(
  '/issue',
  protect,
  authorize('admin'),
  [
    body('bookId').notEmpty().withMessage('Book ID is required'),
    body('memberId').notEmpty().withMessage('Member ID is required'),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookId, memberId } = req.body;

    try {
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      if (book.availableCopies <= 0) {
        return res.status(400).json({ message: 'No copies available' });
      }

      // Check if member already has this book issued
      const existingIssue = await Circulation.findOne({
        book: bookId,
        member: memberId,
        status: 'issued',
      });

      if (existingIssue) {
        return res.status(400).json({ message: 'Member already has this book' });
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + BORROW_DAYS);

      const circulation = await Circulation.create({
        book: bookId,
        member: memberId,
        issuedBy: req.user.id,
        issueDate: new Date(),
        dueDate,
        status: 'issued',
        renewals: 0,
        lateFee: 0,
      });

      // Decrease available copies
      book.availableCopies -= 1;
      await book.save();

      res.status(201).json(circulation);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST /api/circulation/return
// @desc    Return a book
// @access  Private
router.post(
  '/return',
  protect,
  authorize('admin'),
  [body('circulationId').notEmpty().withMessage('Circulation ID is required')],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { circulationId } = req.body;

    try {
      const circulation = await Circulation.findById(circulationId);
      if (!circulation) {
        return res.status(404).json({ message: 'Circulation record not found' });
      }

      if (circulation.status === 'returned') {
        return res.status(400).json({ message: 'Book already returned' });
      }

      // Calculate late fee
      const returnDate = new Date();
      const dueDate = new Date(circulation.dueDate);
      let lateFee = 0;

      if (returnDate > dueDate) {
        const daysOverdue = Math.floor((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        lateFee = daysOverdue * LATE_FEE_PER_DAY;
      }

      circulation.returnDate = returnDate;
      circulation.status = 'returned';
      circulation.lateFee = lateFee;
      await circulation.save();

      // Increase available copies
      const book = await Book.findById(circulation.book);
      if (book) {
        book.availableCopies += 1;
        await book.save();
      }

      res.json(circulation);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST /api/circulation/renew
// @desc    Renew a book
// @access  Private
router.post(
  '/renew',
  protect,
  [body('circulationId').notEmpty().withMessage('Circulation ID is required')],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { circulationId } = req.body;

    try {
      const circulation = await Circulation.findById(circulationId);
      if (!circulation) {
        return res.status(404).json({ message: 'Circulation record not found' });
      }

      if (circulation.status === 'returned') {
        return res.status(400).json({ message: 'Book already returned' });
      }

      if (circulation.renewals >= MAX_RENEWALS) {
        return res.status(400).json({ message: `Maximum ${MAX_RENEWALS} renewals allowed` });
      }

      // Extend due date
      const newDueDate = new Date(circulation.dueDate);
      newDueDate.setDate(newDueDate.getDate() + BORROW_DAYS);

      circulation.dueDate = newDueDate;
      circulation.renewals += 1;
      await circulation.save();

      res.json(circulation);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/circulation/active
// @desc    Get all active circulations
// @access  Private
router.get('/active', protect, async (req: any, res: any) => {
  try {
    const circulations = await Circulation.find({ status: 'issued' })
      .populate('book', 'title author ISBN')
      .populate('member', 'name email')
      .sort({ dueDate: 1 });

    res.json(circulations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/circulation/overdue
// @desc    Get all overdue books
// @access  Private
router.get('/overdue', protect, async (req: any, res: any) => {
  try {
    const now = new Date();
    const circulations = await Circulation.find({
      status: 'issued',
      dueDate: { $lt: now },
    })
      .populate('book', 'title author ISBN')
      .populate('member', 'name email')
      .sort({ dueDate: 1 });

    res.json(circulations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/circulation/history/:memberId
// @desc    Get circulation history for a member
// @access  Private
router.get('/history/:memberId', protect, async (req: any, res: any) => {
  try {
    const circulations = await Circulation.find({ member: req.params.memberId })
      .populate('book', 'title author ISBN')
      .sort({ createdAt: -1 });

    res.json(circulations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
