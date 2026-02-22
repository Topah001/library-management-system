import express from 'express';
import { body, validationResult } from 'express-validator';
import Book from '../models/Book';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/books
// @desc    Get all books with optional search/filter
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { query, category, page = 1, limit = 20 } = req.query;
    
    let searchObj: any = {};
    
    if (query) {
      searchObj.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { ISBN: { $regex: query, $options: 'i' } },
      ];
    }
    
    if (category) {
      searchObj.category = category;
    }

    const books = await Book.find(searchObj)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(searchObj);

    res.json({
      books,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/books/:id
// @desc    Get single book
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/books
// @desc    Create a book
// @access  Private (Admin only)
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('ISBN').notEmpty().withMessage('ISBN is required'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const book = await Book.create(req.body);
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/books/:id
// @desc    Update a book
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
