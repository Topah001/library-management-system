import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  ISBN: string;
  category: string;
  publisher: string;
  publishYear: number;
  description: string;
  coverImage?: string;
  totalCopies: number;
  availableCopies: number;
  location: string;
  createdAt: Date;
}

const BookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: 200,
  },
  author: {
    type: String,
    required: [true, 'Please provide an author'],
    maxlength: 100,
  },
  ISBN: {
    type: String,
    required: [true, 'Please provide an ISBN'],
    unique: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
  },
  publisher: {
    type: String,
    required: true,
  },
  publishYear: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
  },
  totalCopies: {
    type: Number,
    required: true,
    default: 1,
  },
  availableCopies: {
    type: Number,
    required: true,
    default: 1,
  },
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IBook>('Book', BookSchema);
