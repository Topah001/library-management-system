import api from '../utils/api';
import { Book, BookFormData, SearchFilters, ApiResponse } from '../types';

export const bookService = {
  getAll: async (filters?: SearchFilters): Promise<Book[]> => {
    const response = await api.get<ApiResponse<Book[]>>('/books', { params: filters });
    return response.data.data;
  },

  getById: async (id: string): Promise<Book> => {
    const response = await api.get<ApiResponse<Book>>(`/books/${id}`);
    return response.data.data;
  },

  create: async (data: BookFormData): Promise<Book> => {
    const response = await api.post<ApiResponse<Book>>('/books', data);
    return response.data.data;
  },

  update: async (id: string, data: BookFormData): Promise<Book> => {
    const response = await api.put<ApiResponse<Book>>(`/books/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
  },

  search: async (query: string): Promise<Book[]> => {
    const response = await api.get<ApiResponse<Book[]>>('/books/search', { 
      params: { q: query } 
    });
    return response.data.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/books/categories');
    return response.data.data;
  },
};
