import React, { createContext, useContext, useState, useCallback } from "react";
import { UserApi } from "../api/UserApi";

import { UserDto } from "../types/Types";

interface ManagerContextType {
  // Kullanıcı Yönetimi
  pendingUsers: UserDto[];
  userLoading: boolean;
  error: string | null;
  getPendingApprovals: () => Promise<void>;
  approveAsAdmin: (email: string) => Promise<string>; 
  approveAsManager: (email: string) => Promise<string>; 
  approveAsUser: (email: string) => Promise<string>; 
  rejectUser: (email: string) => Promise<string>; 
  
  allUsers: UserDto[];
  getAllUsers: () => Promise<void>;
  deleteUser: (email: string) => Promise<string>; 
  refreshing: boolean;

 
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

export const ManagerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Kullanıcı yönetimi state'leri
  const [allUsers, setAllUsers] = useState<UserDto[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserDto[]>([]);
  const [userLoading, setUserLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);



  // Kullanıcı İşlemleri
  const getPendingApprovals = useCallback(async () => {
    try {
      setUserLoading(true);
      const response = await UserApi.getPendingUsers();
      setPendingUsers(response.data);
      setError(null);
    } catch (error: any) {
      setError(error.message || "Bekleyen onaylar alınamadı");
      setPendingUsers([]);
    } finally {
      setUserLoading(false);
      setRefreshing(false);
    }
  }, []);

  const approveAsAdmin = useCallback(
    async (email: string) => {
      try {
        setUserLoading(true);
        const response = await UserApi.approveAsAdmin(email);
        await getPendingApprovals();
        setError(null);
        return response.message;
      } catch (error: any) {
        setError(error.message || "Admin onaylama işlemi başarısız");
        throw error;
      } finally {
        setUserLoading(false);
      }
    },
    [getPendingApprovals]
  );

  const approveAsManager = useCallback(
    async (email: string) => {
      try {
        setUserLoading(true);
        const response = await UserApi.approveAsManager(email);
        await getPendingApprovals();
        setError(null);
        return response.message;
      } catch (error: any) {
        setError(error.message || "Manager onaylama işlemi başarısız");
        throw error;
      } finally {
        setUserLoading(false);
      }
    },
    [getPendingApprovals]
  );

  const approveAsUser = useCallback(
    async (email: string) => {
      try {
        setUserLoading(true);
        const response = await UserApi.approveAsUser(email);
        await getPendingApprovals();
        setError(null);
        return response.message;
      } catch (error: any) {
        setError(error.message || "Kullanıcı onaylama işlemi başarısız");
        throw error;
      } finally {
        setUserLoading(false);
      }
    },
    [getPendingApprovals]
  );

  const getAllUsers = useCallback(async () => {
    try {
      setUserLoading(true);
      const response = await UserApi.getAllUsers();
      setAllUsers(response.data);
      setError(null);
    } catch (error: any) {
      setError(error.message || "Kullanıcılar alınamadı");
      setAllUsers([]);
    } finally {
      setUserLoading(false);
      setRefreshing(false);
    }
  }, []);



  const rejectUser = useCallback(
    async (email: string) => {
      try {
        setUserLoading(true);
        const response = await UserApi.rejectUser(email);
        await getPendingApprovals();
        setError(null);
        return response.message;
      } catch (error: any) {
        setError(error.message || "Kullanıcı reddetme işlemi başarısız");
        throw error;
      } finally {
        setUserLoading(false);
      }
    },
    [getPendingApprovals]
  );

  const deleteUser = useCallback(
    async (email: string) => {
      try {
        setUserLoading(true);
        const response = await UserApi.softDeleteUser(email);
        await getPendingApprovals();
        setError(null);
        return response.message;
      } catch (error: any) {
        setError(error.message || "Kullanıcı silme işlemi başarısız");
        throw error;
      } finally {
        setUserLoading(false);
      }
    },
    [getPendingApprovals]
  );



  const value: ManagerContextType = {
    pendingUsers,
    userLoading,
    error,
    getPendingApprovals,
    approveAsAdmin,
    approveAsManager,
    approveAsUser,
    rejectUser,

    deleteUser,
    getAllUsers,
    allUsers,
    refreshing,

  };

  return (
    <ManagerContext.Provider value={value}>{children}</ManagerContext.Provider>
  );
};

export const useManager = () => {
  const context = useContext(ManagerContext);
  if (context === undefined) {
    throw new Error("useManager must be used within a ManagerProvider");
  }
  return context;
};

export default ManagerContext;
