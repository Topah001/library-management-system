import express from 'express';
import { body, param, validationResult } from 'express-validator';
import User from '../models/User';
import { protect, authorize } from '../middleware/auth';

// Admin authorization middleware
const adminAuth = authorize('admin');

const router = express.Router();

// Get all members (admin only)
router.get('/', protect, adminAuth, async (req, res) => {
  try {
    const members = await User.find({ role: 'member' }).select('-password');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get member by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-password');
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create member (admin only)
router.post(
  '/',
  protect,
  adminAuth,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, phone } = req.body;

      // Check if member already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Member already exists with this email' });
      }

      const member = new User({
        name,
        email,
        password,
        phone,
        role: 'member',
      });

      await member.save();

      res.status(201).json({
        message: 'Member created successfully',
        member: {
          id: member._id,
          name: member.name,
          email: member.email,
          role: member.role,
          phone: member.phone,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

// Update member
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const member = await User.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Only admin can update other users, regular users can only update themselves
    if (req.user?.role !== 'admin' && req.user?._id?.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this member' });
    }

    if (name) member.name = name;
    if (phone) member.phone = phone;
    if (email) member.email = email;

    await member.save();

    res.json({
      message: 'Member updated successfully',
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        phone: member.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete member (admin only)
router.delete('/:id', protect, adminAuth, async (req, res) => {
  try {
    const member = await User.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (member.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
