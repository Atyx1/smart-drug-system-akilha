// src/api/UserApi.ts
import apiClient from "./Client";
import axios from "axios";
import {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  UserDto,
  AdminCreateDTO,
  UserCreateDTO,
  UserUpdateDTO,
  UserPasswordUpdateDTOInside,
  UserStatusAndRoleResponse,
} from "../types/Types";

interface ExistsResponse {
  exists: boolean;
}

export const UserApi = {
  // Mevcut metodlar (değişmeyecek)
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>(
        "/1.0/login",
        credentials
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>("/1.0/logout");
    return response.data;
  },

  createAdmin: async (data: AdminCreateDTO): Promise<ApiResponse<UserDto>> => {
    const response = await apiClient.post<ApiResponse<UserDto>>(
      "/v1/users/admin",
      data
    );
    return response.data;
  },

  createUser: async (data: UserCreateDTO): Promise<ApiResponse<UserDto>> => {
    const response = await apiClient.post<ApiResponse<UserDto>>(
      "/v1/users",
      data
    );
    return response.data;
  },

  updateUser: async (data: UserUpdateDTO): Promise<ApiResponse<UserDto>> => {
    const response = await apiClient.put<ApiResponse<UserDto>>(
      "/v1/users",
      data
    );
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<UserDto>> => {
    const response = await apiClient.get<ApiResponse<UserDto>>(
      "/v1/users/current"
    );
    return response.data;
  },

  softDeleteUser: async (email: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/v1/users/admin/${email}`
      );

      return response.data;
    } catch (error) {
      console.error("Error soft deleting user:", error);
      throw error;
    }
  },

  deleteCurrentUser: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      "/v1/users/current"
    );
    return response.data;
  },

  resetPasswordInside: async (
    data: UserPasswordUpdateDTOInside
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(
      "/v1/users/password",
      data
    );
    return response.data;
  },

  passwordChangeActivation: async (
    email: string
  ): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        "/v1/users/password/change/activation",
        null,
        {
          params: { email },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  activateUser: async (token: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.get<ApiResponse<void>>(
      "/v1/users/activate",
      {
        params: { token },
      }
    );
    return response.data;
  },

  checkEmailExists: async (email: string): Promise<boolean> => {
    try {
      const response = await apiClient.get<ExistsResponse>(
        "/v1/users/check-email",
        {
          params: { email },
        }
      );
      return response.data.exists;
    } catch (error) {
      throw new Error("E-posta kontrolü sırasında bir hata oluştu");
    }
  },

  checkUsernameExists: async (username: string): Promise<boolean> => {
    try {
      const response = await apiClient.get<ExistsResponse>(
        "/v1/users/check-username",
        {
          params: { username },
        }
      );
      return response.data.exists;
    } catch (error) {
      throw new Error("Kullanıcı adı kontrolü sırasında bir hata oluştu");
    }
  },

  getUserStatusAndRole: async (
    userId: number
  ): Promise<ApiResponse<UserStatusAndRoleResponse>> => {
    try {
      const response = await apiClient.get<
        ApiResponse<UserStatusAndRoleResponse>
      >(`/v1/users/${userId}/status-role`);
      return response.data;
    } catch (error: any) {
      console.error("Status and role request failed:", error);
      throw error;
    }
  },

  approveAsAdmin: async (email: string): Promise<ApiResponse<void>> => {
    try {
      // Direkt email'i kullan, Axios otomatik encode edecek
      const response = await apiClient.post<ApiResponse<void>>(
        `/v1/users/approve-admin/${email}`
      );
      return response.data;
    } catch (error) {
      console.error("Error approving user as admin:", error);
      throw error;
    }
  },

  approveAsManager: async (email: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        `/v1/users/approve-manager/${email}`
      );
      return response.data;
    } catch (error) {
      console.error("Error approving user as manager:", error);
      throw error;
    }
  },

  approveAsUser: async (email: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        `/v1/users/approve-user/${email}`
      );

      return response.data;
    } catch (error) {
      console.error("Error approving user as regular user:", error);
      throw error;
    }
  },

  rejectUser: async (email: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        `/v1/users/reject/${email}`
      );
      return response.data;
    } catch (error) {
      console.error("Error rejecting user:", error);
      throw error;
    }
  },

  getPendingUsers: async (): Promise<ApiResponse<UserDto[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<UserDto[]>>(
        "/v1/users/pending"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching pending users:", error);
      throw error;
    }
  },

  getAllUsers: async (): Promise<ApiResponse<UserDto[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<UserDto[]>>(
        "/v1/users/all"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },
};
