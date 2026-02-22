import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICirculation extends Document {
  book: Types.ObjectId;
  member: Types.ObjectId;
  issuedBy: Types.ObjectId;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'issued' | 'returned' | 'overdue';
  renewals: number;
  lateFee: number;
  createdAt: Date;
}

const CirculationSchema = new Schema<ICirculation>({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  member: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  issuedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['issued', 'returned', 'overdue'],
    default: 'issued',
  },
  renewals: {
    type: Number,
    default: 0,
  },
  lateFee: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICirculation>('Circulation', CirculationSchema);
