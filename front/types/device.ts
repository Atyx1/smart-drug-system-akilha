import { User } from './user';

export interface Device {
  id: number;
  name: string;
  password?: string;
  owner?: User;
  viewers?: User[];
}

export interface Medicine {
  id: number;
  name: string;
  dosage: string;
  owner?: User;
  deleted?: boolean;
}
