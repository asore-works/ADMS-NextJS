// src/lib/api/auth.ts
import axios from 'axios';
import { LoginCredentials, LoginResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);

  const response = await axios.post<LoginResponse>(
    `${API_URL}/api/v1/login/access-token`,
    formData.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data;
};