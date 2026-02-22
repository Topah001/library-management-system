export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Circulation {
  _id: string;
  book: Book;
  member: User;
  issuedBy: User;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  renewals: number;
  lateFee: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'member';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  ISBN: string;
  category: string;
  publisher: string;
  publishYear: number;
  description: string;
  coverImage?: string;
  totalCopies: number;
  location: string;
}

export interface MemberFormData {
  name: string;
  email: string;
  phone: string;
  role?: 'admin' | 'member';
}

export interface IssueBookData {
  bookId: string;
  memberId: string;
  dueDays?: number;
}

export interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  borrowedBooks: number;
  overdueBooks: number;
  availableBooks: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  author?: string;
  ISBN?: string;
  available?: boolean;
}
