import api from '../utils/api';
import { Circulation, IssueBookData, ApiResponse } from '../types';

export const circulationService = {
  issueBook: async (data: IssueBookData): Promise<Circulation> => {
    const response = await api.post<ApiResponse<Circulation>>('/circulation/issue', data);
    return response.data.data;
  },

  returnBook: async (circulationId: string): Promise<Circulation> => {
    const response = await api.post<ApiResponse<Circulation>>(`/circulation/return`, { 
      circulationId 
    });
    return response.data.data;
  },

  renewBook: async (circulationId: string): Promise<Circulation> => {
    const response = await api.post<ApiResponse<Circulation>>(`/circulation/renew`, { 
      circulationId 
    });
    return response.data.data;
  },

  getActiveLoans: async (): Promise<Circulation[]> => {
    const response = await api.get<ApiResponse<Circulation[]>>('/circulation/active');
    return response.data.data;
  },

  getHistory: async (memberId?: string): Promise<Circulation[]> => {
    const response = await api.get<ApiResponse<Circulation[]>>('/circulation/history', { 
      params: { memberId } 
    });
    return response.data.data;
  },

  getOverdue: async (): Promise<Circulation[]> => {
    const response = await api.get<ApiResponse<Circulation[]>>('/circulation/overdue');
    return response.data.data;
  },

  getDashboardStats: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/circulation/stats');
    return response.data.data;
  },
};
