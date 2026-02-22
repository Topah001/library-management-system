import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config';
import User from '../models/User';
import Book from '../models/Book';

const seedData = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@libraryhub.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+1234567890',
    });
    console.log('Admin user created:', adminUser.email);

    // Create sample member
    const memberUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'member',
      phone: '+1234567891',
    });
    console.log('Member user created:', memberUser.email);

    // Create sample books
    const sampleBooks = [
      {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        ISBN: '978-0262033848',
        category: 'Computer Science',
        publisher: 'MIT Press',
        publishYear: 2009,
        description: 'A comprehensive introduction to the modern study of computer algorithms.',
        totalCopies: 5,
        availableCopies: 5,
        location: 'CS-A-001',
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        ISBN: '978-0132350884',
        category: 'Computer Science',
        publisher: 'Prentice Hall',
        publishYear: 2008,
        description: 'A Handbook of Agile Software Craftsmanship.',
        totalCopies: 3,
        availableCopies: 3,
        location: 'CS-A-002',
      },
      {
        title: 'Design Patterns',
        author: 'Gang of Four',
        ISBN: '978-0201633610',
        category: 'Computer Science',
        publisher: 'Addison-Wesley',
        publishYear: 1994,
        description: 'Elements of Reusable Object-Oriented Software.',
        totalCopies: 4,
        availableCopies: 4,
        location: 'CS-A-003',
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt',
        ISBN: '978-0135957059',
        category: 'Computer Science',
        publisher: 'Addison-Wesley',
        publishYear: 2019,
        description: 'Your Journey to Mastery, 20th Anniversary Edition.',
        totalCopies: 3,
        availableCopies: 3,
        location: 'CS-A-004',
      },
      {
        title: 'Calculus: Early Transcendentals',
        author: 'James Stewart',
        ISBN: '978-1285741550',
        category: 'Mathematics',
        publisher: 'Cengage Learning',
        publishYear: 2015,
        description: 'Single Variable Calculus.',
        totalCopies: 10,
        availableCopies: 10,
        location: 'MATH-B-001',
      },
      {
        title: 'Linear Algebra and Its Applications',
        author: 'David C. Lay',
        ISBN: '978-0321982384',
        category: 'Mathematics',
        publisher: 'Pearson',
        publishYear: 2015,
        description: 'Linear algebra and its applications.',
        totalCopies: 8,
        availableCopies: 8,
        location: 'MATH-B-002',
      },
      {
        title: 'Physics for Scientists and Engineers',
        author: 'Raymond A. Serway',
        ISBN: '978-1305952307',
        category: 'Physics',
        publisher: 'Cengage Learning',
        publishYear: 2018,
        description: 'A strategic approach with modern physics.',
        totalCopies: 6,
        availableCopies: 6,
        location: 'PHYS-C-001',
      },
      {
        title: 'Chemistry: The Central Science',
        author: 'Theodore L. Brown',
        ISBN: '978-0134414232',
        category: 'Chemistry',
        publisher: 'Pearson',
        publishYear: 2017,
        description: 'Chemistry: The Central Science.',
        totalCopies: 7,
        availableCopies: 7,
        location: 'CHEM-D-001',
      },
    ];

    await Book.insertMany(sampleBooks);
    console.log('Sample books created');

    console.log('Seed data completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
