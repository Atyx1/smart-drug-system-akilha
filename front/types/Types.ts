import {
  AuthStackNavigationProp,
  AuthStackParamList,
  RootStackParamList,
} from "@/navigation/navigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// ================ ENUMS ================

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
}

export enum UserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  DISABLED = "DISABLED",
  INACTIVE = "INACTIVE",
}

export enum ActivityType {
  // User Operations
  USER_LOGIN = "USER_LOGIN",
  USER_LOGOUT = "USER_LOGOUT",
  USER_REGISTERED = "USER_REGISTERED",
  USER_PASSWORD_RESET = "USER_PASSWORD_RESET",
  USER_UPDATED = "USER_UPDATED",

  // Device Operations
  DEVICE_REQUEST_SUBMITTED = "DEVICE_REQUEST_SUBMITTED",
  DEVICE_REQUEST_APPROVED = "DEVICE_REQUEST_APPROVED",
  DEVICE_REQUEST_REJECTED = "DEVICE_REQUEST_REJECTED",
  DEVICE_VIEWER_ADDED = "DEVICE_VIEWER_ADDED",
  DEVICE_VIEWER_REMOVED = "DEVICE_VIEWER_REMOVED",

  // Compartment & Medicine Operations
  COMPARTMENT_CREATED = "COMPARTMENT_CREATED",
  COMPARTMENT_UPDATED = "COMPARTMENT_UPDATED",
  MEDICINE_ADDED = "MEDICINE_ADDED",
  MEDICINE_UPDATED = "MEDICINE_UPDATED",

  // Pill Operations
  PILL_DROPPED = "PILL_DROPPED",
  PILL_TAKEN = "PILL_TAKEN",
  PILL_NOT_TAKEN = "PILL_NOT_TAKEN",
  PILL_DISPENSED = "PILL_DISPENSED",

  // Notification Operations
  NOTIFICATION_SENT = "NOTIFICATION_SENT",
  NOTIFICATION_FAILED = "NOTIFICATION_FAILED",
  PILL_DROP_NOTIFICATION = "PILL_DROP_NOTIFICATION",
  COMPARTMENT_CREATION_NOTIFICATION = "COMPARTMENT_CREATION_NOTIFICATION",

  // System Operations
  SYSTEM_ERROR = "SYSTEM_ERROR",
  API_CALL = "API_CALL",
  DATABASE_OPERATION = "DATABASE_OPERATION",
}

// ================ BASE INTERFACES ================
export interface UserStatusAndRoleResponse {
  status: UserStatus;
  role: UserRole;
}

export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
  path: string;
  validationErrors?: Record<string, string>;
}

// ================ ACTIVITY LOGS ================
export interface ActivityLogResponse {
  id: number;
  timestamp: string;
  username: string;
  actionType: ActivityType;
  actionTypeDescription: string;
  description: string;
  details: string | null;
}

export interface ActivityLogSearchCriteria {
  username?: string;
  usernames?: string[];
  storeName?: string;
  actionType?: ActivityType;
  startDate?: string; // ISO format
  endDate?: string; // ISO format
  userId?: number; // User ID for filtering
  userIds?: number[]; // Multiple user IDs for filtering
}

export interface ActivityTypeDTO {
  name: string;
  description: string;
}

// ================ PAGINATION & SEARCH ================

export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

export interface PageResponse<T> {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  numberOfElements: number;
  empty: boolean;
}

// ================ AUTH & USER ================
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Token {
  id: number;
  userId: number;
  prefix: string;
  token: string;
  createdAt: string;
}

export interface UserDto {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  active: boolean;
  storeId?: number;
  storeName?: string;
  isOwner?: boolean; // Frontend tarafında dinamik olarak ekleniyor
}

export interface AuthResponse {
  user: UserDto;
  token: Token;
  tokenType: string;
  deviceId: number;
}

// ================ USER DTOs ================
export interface AdminCreateDTO {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

export interface UserCreateDTO {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

export interface UserUpdateDTO {
  id: number;
  fullName: string;
}

export interface UserPasswordUpdateDTOInside {
  oldPassword: string;
  newPassword: string;
}

// From api-docs.json: components.schemas.AssignedUserDTO
export interface AssignedUserDTO {
  id: number;
  fullName: string;
  email: string;
}

// From api-docs.json: components.schemas.GenericMessage
export interface GenericMessage {
  message: string;
}

export interface ApiResponseGenericMessage
  extends ApiResponse<GenericMessage> {}

export interface AssignUsersRequest {
  userIds: number[];
}

// ================ REGISTER SCREEN ================
export interface RegisterScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Register">;
  route: RouteProp<AuthStackParamList, "Register">;
}

export interface StoreResponseDTO {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
}

// ================ DEVICE TYPES ================

// Moved to bottom to avoid duplication

export interface PendingApproval {
  id: number;
  user: UserDto;
  requestDate: string;
  type: "ROLE" | "DEVICE_VIEWER";
  device: Device;
}

export interface Device {
  id: number;
  name: string;
  password?: string;
  owner: UserDto;
  viewers: UserDto[];
}

// ================ COMPARTMENTS ================
export interface CompartmentCreateAndUpdateRequest {
  deviceId: number;
  idx?: number; // 1-4 arasında olabilir
  quantity?: number;
  scheduleList: string[]; // ISO 8601 tarih formatında
  medicine: {
    name: string;
    dosage: string;
  };
}

export interface CompartmentDto {
  compartmentId: number;
  idx: number;
  medicineName: string;
  dosage: string;
  remaining: number;
  dates: string[];
}

// ================ NEW COMPARTMENT DTOs ================
export interface PillInstanceSummaryDto {
  scheduledAt: string; // date-time format
  status:
    | "PENDING"
    | "DISPENSED_WAITING"
    | "TAKEN_ON_TIME"
    | "TAKEN_LATE"
    | "MISSED";
  consumedAt?: string; // date-time format, optional
}

export interface CompartmentSummaryDto {
  compartmentId: number;
  idx: number;
  medicineName: string;
  medicineDosage: string;
  currentStock: number;
  scheduleSummary: PillInstanceSummaryDto[];
}

export interface PendingApprovalDto {
  id: number;
  userEmail: string;
  userFullName: string;
  requestDate: string;
  type: "ROLE" | "DEVICE_VIEWER";
  deviceId?: number;
  deviceName?: string;
}

export interface DeviceResponse {
  id: number;
  name: string;
  manager: boolean; // 👈 bunu ekle
}
