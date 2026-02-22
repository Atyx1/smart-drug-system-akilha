import apiClient from "./Client";
import {
  ApiResponse,
  PendingApprovalDto,
  DeviceResponse,
  UserDto,
} from "../types/Types";

export const DeviceApi = {
  // Get all devices associated with the current user
  getMyDevices: async (): Promise<DeviceResponse[]> => {
    try {
      const response = await apiClient.get<ApiResponse<DeviceResponse[]>>(
        "/devices/my"
      );

      return response.data.data || [];
    } catch (error) {
      console.error("❌ DeviceApi: Error fetching devices:", error);
      throw error;
    }
  },

  // Get my device ID
  getMyDeviceId: async (): Promise<number | null> => {
    try {
      const response = await apiClient.get<ApiResponse<number>>(
        "/devices/my-device-id"
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching device ID:", error);
      return null;
    }
  },

  // Get pending approval requests for a specific device
  getPendingRequests: async (
    deviceId: number
  ): Promise<PendingApprovalDto[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PendingApprovalDto[]>>(
        `/devices/${deviceId}/caregiver/requests`
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      throw error;
    }
  },

  // Approve a caregiver request
  approveRequest: async (approvalId: number): Promise<void> => {
    try {
      await apiClient.post(`/devices/caregiver/requests/${approvalId}/approve`);
    } catch (error) {
      console.error("Error approving request:", error);
      throw error;
    }
  },

  // Reject a caregiver request
  rejectRequest: async (approvalId: number): Promise<void> => {
    try {
      await apiClient.post(`/devices/caregiver/requests/${approvalId}/reject`);
    } catch (error) {
      console.error("Error rejecting request:", error);
      throw error;
    }
  },

  // Register a new device
  registerDevice: async (name: string, password: string): Promise<void> => {
    try {
      await apiClient.post("/devices/register", { name, password });
    } catch (error) {
      console.error("Error registering device:", error);
      throw error;
    }
  },

  // Connect to device as a manager
  connectAsManager: async (name: string, password: string): Promise<void> => {
    try {
      await apiClient.post("/devices/connectForManager", { name, password });
    } catch (error) {
      console.error("Error connecting as manager:", error);
      throw error;
    }
  },

  // Update a device
  updateDevice: async (
    deviceId: number,
    name: string,
    password: string
  ): Promise<void> => {
    try {
      await apiClient.put(`/devices/${deviceId}`, { name, password });
    } catch (error) {
      console.error("Error updating device:", error);
      throw error;
    }
  },

  // Delete a device
  deleteDevice: async (deviceId: number): Promise<void> => {
    try {
      await apiClient.delete(`/devices/${deviceId}`);
    } catch (error) {
      console.error("Error deleting device:", error);
      throw error;
    }
  },

  // Send a caregiver request
  sendCaregiverRequest: async (name: string): Promise<void> => {
    try {
      await apiClient.post("/devices/caregiver/request", { name });
    } catch (error) {
      console.error("Error sending caregiver request:", error);
      throw error;
    }
  },

  getApprovedUsers: async (deviceId: number): Promise<UserDto[]> => {
    try {
      console.log(
        "🔄 DeviceApi: Fetching approved users for deviceId:",
        deviceId
      );
      const response = await apiClient.get<UserDto[]>(
        `/devices/${deviceId}/caregiver/approved`
      );
      console.log("✅ DeviceApi: Raw approved users response:", response.data);

      // API direkt array döndürüyor, wrapper yok
      const users = Array.isArray(response.data) ? response.data : [];

      // Tüm kullanıcılar aynı şekilde görünecek (yakın kişi olarak)
      const usersWithOwnerFlag = users.map((user) => ({
        ...user,
        isOwner: false, // Hepsi yakın kişi olarak görünecek
      }));

      console.log("✅ DeviceApi: Processed users:", usersWithOwnerFlag);
      return usersWithOwnerFlag;
    } catch (error) {
      console.error("❌ DeviceApi: Error fetching approved users:", error);
      throw error;
    }
  },

  // Block a user (remove caregiver access)
  blockUser: async (deviceId: number, userId: number): Promise<void> => {
    try {
      await apiClient.post(`/devices/${deviceId}/caregiver/${userId}/block`);
    } catch (error) {
      console.error("Error blocking user:", error);
      throw error;
    }
  },
};
