import { User } from "./user";
import { Device } from "./device";

export * from './user';
export * from './device';

export interface PendingApproval {
  id: number;
  user: User;
  requestDate: string;
  type: 'ROLE' | 'DEVICE_VIEWER';
  device: Device;
}

export interface DeviceResponse {
  id: number;
  name: string;
}

export interface DeviceRegisterRequest {
  name: string;
  password: string;
}

export interface DeviceUpdateRequest {
  name: string;
  password: string;
}

export interface DeviceCaregiverRequest {
  name: string;
}

export interface CompartmentDto {
  compartmentId: number;
  idx: number;
  medicineName: string;
  dosage: string;
  remaining: number;
  dates: string[];
}
