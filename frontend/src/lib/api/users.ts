import axios from 'axios';
import { UpdateUserProfile, User } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const updateUserProfile = async (userId: string, data: UpdateUserProfile): Promise<User> => {
  const token = localStorage.getItem('token');
  const response = await axios.put<User>(
    `${API_URL}/api/v1/users/${userId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};