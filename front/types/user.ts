export type UserRole = 'USER' | 'ADMIN' | 'MANAGER';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'DISABLED' | 'INACTIVE';

export interface User {
  id: number;
  username: string;
  fullName?: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: string;
  deleted?: boolean;
  deletedAt?: string;
}

export interface UserDto {
  id: number;
  username: string;
  fullName?: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  active: boolean;
}
