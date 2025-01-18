// src/types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  is_active: boolean;
}

export interface UpdateUserProfile {
  first_name: string;
  last_name: string;
  phone_number?: string;
}