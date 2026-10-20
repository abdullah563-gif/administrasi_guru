export type UserRole = 'admin' | 'teacher';
export type UserStatus = 'pending_activation' | 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  nip?: string;
  schoolName: string;
  schoolType: 'SD' | 'MI';
  role: UserRole;
  status: UserStatus;
  activationToken?: string;
  tokenCreatedAt?: string;
  registeredAt: string;
  lastLoginAt?: string;
  activatedAt?: string;
  notes?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  nip?: string;
  schoolName: string;
  schoolType: 'SD' | 'MI';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ActivationPayload {
  userId: string;
  token: string;
}
