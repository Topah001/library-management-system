import api from '../utils/api';
import { User, MemberFormData, ApiResponse } from '../types';

export const memberService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/members');
    return response.data.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/members/${id}`);
    return response.data.data;
  },

  create: async (data: MemberFormData): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/members', data);
    return response.data.data;
  },

  update: async (id: string, data: MemberFormData): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/members/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/members/${id}`);
  },

  getMemberHistory: async (id: string): Promise<any> => {
    const response = await api.get<ApiResponse<any>>(`/members/${id}/history`);
    return response.data.data;
  },
};
