import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { UserDto, AuthResponse, UserRole } from "../types/Types";
import { UserApi } from "../api/UserApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { connectWebSocket, disconnectWebSocket } from "../api/ConnectWebSocket";

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  deviceId: number | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  showUpdateNotification: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updatedUser: UserDto) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  checkUserUpdate: () => Promise<boolean>;
  updateUserRoleAndStatus: (userId: number) => Promise<boolean>;
  clearAuthData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [lastChecked, setLastChecked] = useState<number>(Date.now());
  const navigation = useNavigation();

  const userRole = user?.role || null;

  useEffect(() => {
    (async () => {
      const secureToken = await SecureStore.getItemAsync("token");
      const secureDeviceId = await SecureStore.getItemAsync("deviceId");

      console.log("— DEBUG AUTH STATE —");
      console.log("SecureStore token:", secureToken);
      console.log("SecureStore deviceId:", secureDeviceId);
    })();
  }, []);

  const flushLocalAuth = useCallback(async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("deviceId");
    await AsyncStorage.removeItem("user"); // varsa yedek

    setToken(null);
    setUser(null);
    setDeviceId(null);
    setIsAuthenticated(false);
  }, []);

  const storeAuthData = async (authResponse: AuthResponse) => {
    try {
      await SecureStore.setItemAsync("token", authResponse.token.token);
      await SecureStore.setItemAsync("user", JSON.stringify(authResponse.user));

      // Store the deviceId
      if (authResponse.deviceId) {
        await SecureStore.setItemAsync(
          "deviceId",
          authResponse.deviceId.toString()
        );
        console.log(
          "[SECURE_STORE] DeviceId başarıyla kaydedildi:",
          authResponse.deviceId
        );
      }

      console.log("[SECURE_STORE] Token ve user başarıyla kaydedildi.");
    } catch (error) {
      console.error("[SECURE_STORE] Hata:", error);
    }
  };

  const clearAuthData = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("deviceId");
    } catch (error) {
      console.error("Error clearing secure auth data:", error);
    }
  };

  const checkUserUpdate = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return false;

    try {
      const now = Date.now();
      const MINIMUM_CHECK_INTERVAL = 10000; // 10 saniye

      if (now - lastChecked < MINIMUM_CHECK_INTERVAL) {
        return false;
      }

      const response = await UserApi.getUserStatusAndRole(user.id);
      console.log("User Status and Role Response:", response);

      if (response && response.data) {
        const newData = response.data;

        const hasChanges =
          newData.role !== user.role || newData.status !== user.status;

        if (hasChanges) {
          console.log("User updates detected:", {
            oldData: {
              role: user.role,
              status: user.status,
            },
            newData: {
              role: newData.role,
              status: newData.status,
            },
          });

          setShowUpdateNotification(true);

          setTimeout(async () => {
            await logout();
          }, 3000);

          setLastChecked(now);
          return true;
        }
      }

      setLastChecked(now);
      return false;
    } catch (error) {
      console.error("Error in checkUserUpdate:", error);
      return false;
    }
  }, [user, lastChecked, isAuthenticated]);

  useEffect(() => {
    if (!user?.id || !isAuthenticated) return;

    const unsubscribe = navigation.addListener("state", () => {
      checkUserUpdate();
    });

    return unsubscribe;
  }, [navigation, user?.id, checkUserUpdate]);

  const login = useCallback(async (email: string, password: string) => {
    flushLocalAuth();
    try {
      setIsLoading(true);
      const response = await UserApi.login({ email, password });
      console.log("Login Response:", response);

      if (response) {
        const token = response.token.token;
        const user = response.user;
        const deviceId = response.deviceId;

        console.log("[LOGIN_SUCCESS] Token:", token);
        console.log("[LOGIN_SUCCESS] User:", user);

        await storeAuthData(response);

        setToken(token);
        setUser(user);
        setDeviceId(deviceId);
        setIsAuthenticated(true);

        // Login başarılı olduğunda WebSocket bağlantısını başlat
        console.log("[LOGIN_SUCCESS] WebSocket bağlantısı başlatılıyor...");
        await connectWebSocket();
      }
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      // Logout sırasında WebSocket bağlantısını kapat
      console.log("[LOGOUT] WebSocket bağlantısı kapatılıyor...");
      disconnectWebSocket();

      await UserApi.logout();
      setUser(null);
      setToken(null);
      setDeviceId(null);
      setIsAuthenticated(false);
      setShowUpdateNotification(false);
      await clearAuthData();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [flushLocalAuth]);

  const updateUserProfile = useCallback(async (updatedUser: UserDto) => {
    try {
      setIsLoading(true);
      const response = await UserApi.updateUser({
        id: updatedUser.id,
        fullName: updatedUser.fullName,
      });

      if (response.data) {
        setUser(response.data);
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      try {
        setIsLoading(true);
        await UserApi.resetPasswordInside({
          oldPassword,
          newPassword,
        });
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedToken = await SecureStore.getItemAsync("token");
      const storedUser = await SecureStore.getItemAsync("user");
      const storedDeviceId = await SecureStore.getItemAsync("deviceId");

      console.log("[CHECK_AUTH] TOKEN:", storedToken);
      console.log("[CHECK_AUTH] USER:", storedUser);
      console.log("[CHECK_AUTH] DEVICE_ID:", storedDeviceId);

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        if (storedDeviceId) {
          setDeviceId(parseInt(storedDeviceId, 10));
        }
        setIsAuthenticated(true);
        console.log("[CHECK_AUTH] Restored Auth State:", {
          parsedUser,
          deviceId: storedDeviceId,
        });

        // Auth durumu restore edildiğinde WebSocket bağlantısını başlat
        console.log("[CHECK_AUTH] WebSocket bağlantısı başlatılıyor...");
        await connectWebSocket();
      } else {
        console.log("[CHECK_AUTH] Token or user not found.");
      }
    } catch (error) {
      console.error("[CHECK_AUTH] Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    token,
    deviceId,
    isLoading,
    isAuthenticated,
    userRole,
    showUpdateNotification,
    login,
    logout,
    updateUserProfile,
    changePassword,
    checkUserUpdate,
    updateUserRoleAndStatus: checkUserUpdate,
    clearAuthData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuthorization = () => {
  const { user } = useAuth();

  const isAdmin = () => user?.role === UserRole.ADMIN;
  const isManager = () => user?.role === UserRole.MANAGER;
  const isUser = () => user?.role === UserRole.USER;

  const hasRole = (role: UserRole) => user?.role === role;
  const hasAnyRole = (roles: UserRole[]) =>
    user ? roles.includes(user.role) : false;

  return {
    isAdmin,
    isManager,
    isUser,
    hasRole,
    hasAnyRole,
  };
};

export default AuthContext;
