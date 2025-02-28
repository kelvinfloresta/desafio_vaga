import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TransactionResponse {
  data: {
    transactions: Transaction[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface UploadResponse {
  message: string;
  data: {
    processedCount: number;
    executionTime: string;
  };
}

export interface Transaction {
  _id: string;
  transactionId: string;
  client: {
    _id: string;
    name: string;
    document: string;
  };
  date: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export const transactionService = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/transactions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  get: async (
    { page = 1, limit = 10, name, startDate, endDate }: { page: number, limit: number, name?: string; startDate?: string; endDate?: string }
  ): Promise<TransactionResponse> => {
    const response = await api.get<TransactionResponse>('/transactions', { params: { page, limit, name, startDate, endDate } });
    return response.data;
  },
};

export default api;