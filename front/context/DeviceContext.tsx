import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

import Toast from "react-native-toast-message";
import { DeviceResponse } from "@/types";
import { PendingApprovalDto } from "@/types/Types";
import { DeviceApi } from "@/api/DeviceApi";

interface DeviceContextType {
  devices: DeviceResponse[];
  //pendingRequests: PendingApproval[];
  pendingRequests: PendingApprovalDto[];
  approvedUsers: Array<Record<string, any>>;
  loading: boolean;
  error: string | null;
  selectedDeviceId: number | null;
  fetchDevices: () => Promise<void>;
  fetchPendingRequests: (deviceId: number) => Promise<void>;
  approveRequest: (approvalId: number) => Promise<void>;
  rejectRequest: (approvalId: number) => Promise<void>;
  blockUser: (userId: number) => Promise<void>;
  setSelectedDeviceId: (deviceId: number) => void;
  connectAsManager: (name: string, password: string) => Promise<void>;
  sendCaregiverRequest: (name: string) => Promise<void>;
  fetchApprovedUsers: (deviceId: number) => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [devices, setDevices] = useState<DeviceResponse[]>([]);
  const [deviceId, setDeviceId] = useState<number | null>(null);
  // const [pendingRequests, setPendingRequests] = useState<PendingApproval[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingApprovalDto[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 DeviceContext: Fetching devices...");
      const deviceList = await DeviceApi.getMyDevices();
      console.log("✅ DeviceContext fetchDevices response:", deviceList);

      if (deviceList.length > 0) {
        const firstDevice = deviceList[0];
        setDevices(deviceList);
        setDeviceId(firstDevice.id);
        setSelectedDeviceId(firstDevice.id);
        console.log(
          "DeviceContext selectedDeviceId set edildi:",
          firstDevice.id
        );
      } else {
        setDevices([]);
        setDeviceId(null);
        setSelectedDeviceId(null);
        console.log("Device yok, selectedDeviceId null olarak setlendi.");
      }

      //setDevices(device); // Listeye sararak frontend uyumluluğunu koruyoruz
      //setDeviceId(device.id || null);
      //setSelectedDeviceId(device.id || null);
      //console.log("DeviceContext selectedDeviceId set edildi:", device.id);
    } catch (err) {
      setError("Error fetching devices");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load devices",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async (deviceId: number) => {
    if (!deviceId) {
      console.log("❌ fetchPendingRequests: deviceId is null or undefined");
      return;
    }
    console.log(
      "🔄 fetchPendingRequests: Starting fetch for deviceId:",
      deviceId
    );
    setLoading(true);
    setError(null);

    try {
      const response = await DeviceApi.getPendingRequests(deviceId);
      console.log("✅ DeviceContext fetchPendingRequests response:", response);

      setPendingRequests(response);
      const currentDevice = devices.find((d) => d.id === deviceId);
      if (currentDevice) {
        setApprovedUsers([]);
      }
    } catch (err: any) {
      console.error("❌ fetchPendingRequests error:", err);
      setError("Error fetching pending requests");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err?.message || "Failed to load requests",
      });
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (approvalId: number) => {
    setLoading(true);
    setError(null);
    try {
      await DeviceApi.approveRequest(approvalId);
      setPendingRequests((prev) => prev.filter((req) => req.id !== approvalId));
      if (selectedDeviceId) {
        await fetchPendingRequests(selectedDeviceId);
      }
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Request approved",
        visibilityTime: 2000,
      });
    } catch (err) {
      setError("Error approving request");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to approve request",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async (approvalId: number) => {
    setLoading(true);
    setError(null);
    try {
      await DeviceApi.rejectRequest(approvalId);
      setPendingRequests((prev) => prev.filter((req) => req.id !== approvalId));
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Request rejected",
        visibilityTime: 2000,
      });
    } catch (err) {
      setError("Error rejecting request");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to reject request",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const blockUser = async (userId: number) => {
    setLoading(true);
    setError(null);

    if (!selectedDeviceId) {
      setError("No device selected");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No device selected",
      });
      setLoading(false);
      return;
    }

    try {
      await DeviceApi.blockUser(selectedDeviceId, userId);
      setApprovedUsers((prev) => prev.filter((user) => user.id !== userId));
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "User blocked",
        visibilityTime: 2000,
      });
    } catch (err) {
      setError("Error blocking user");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to block user",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const connectAsManager = async (name: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await DeviceApi.connectAsManager(name, password);
      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Cihaza başarıyla bağlanıldı",
      });
      await fetchDevices();
    } catch (err: any) {
      setError("Bağlantı hatası");
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: err?.response?.data?.message || "Cihaza bağlanırken hata oluştu",
      });
      console.error("connectAsManager error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendCaregiverRequest = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      await DeviceApi.sendCaregiverRequest(name);
      Toast.show({
        type: "success",
        text1: "İstek gönderildi",
        text2: "Cihaz sahibi onayladığında görebileceksiniz",
      });
    } catch (err: any) {
      setError("İstek gönderme hatası");
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: err?.response?.data?.message || "İstek gönderilemedi",
      });
      console.error("sendCaregiverRequest error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedUsers = async (deviceId: number) => {
    if (!deviceId) {
      console.log("❌ fetchApprovedUsers: deviceId is null or undefined");
      return;
    }
    console.log(
      "🔄 fetchApprovedUsers: Starting fetch for deviceId:",
      deviceId
    );
    setLoading(true);
    setError(null);
    try {
      const response = await DeviceApi.getApprovedUsers(deviceId);
      console.log("✅ Device Context fetchApprovedUsers - response:", response);
      setApprovedUsers(response);
    } catch (err: any) {
      console.error("❌ fetchApprovedUsers error:", err);
      setError("Error fetching approved users");
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: err?.message || "Onaylı kullanıcılar yüklenemedi",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    if (selectedDeviceId) {
      // no-op
    }
  }, []);

  const value = {
    devices,
    pendingRequests,
    approvedUsers,
    loading,
    error,
    selectedDeviceId,
    fetchDevices,
    fetchPendingRequests,
    approveRequest,
    rejectRequest,
    blockUser,
    setSelectedDeviceId,
    connectAsManager,
    sendCaregiverRequest,
    fetchApprovedUsers,
  };

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
};
