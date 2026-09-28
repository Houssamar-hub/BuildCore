import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: { url: string; publicId: string };
  preferences: { language: string; theme: string; notifications: boolean };
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: AuthUser;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<{ data: AuthResponse }>('/auth/login', credentials);
    return response.data.data!;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<AuthUser> => {
    const response = await api.get<{ data: AuthUser }>('/auth/me');
    return response.data.data!;
  },

  updateProfile: async (data: Partial<AuthUser>): Promise<AuthUser> => {
    const response = await api.patch<{ data: AuthUser }>('/auth/update-profile', data);
    return response.data.data!;
  },

  updatePassword: async (data: { currentPassword: string; newPassword: string }): Promise<AuthResponse> => {
    const response = await api.patch<{ data: AuthResponse }>('/auth/update-password', data);
    return response.data.data!;
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    const response = await api.post<{ data: { token: string; refreshToken: string } }>('/auth/refresh-token', { refreshToken });
    return response.data.data!;
  },
};
