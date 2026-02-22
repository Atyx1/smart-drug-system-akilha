// src/context/CompartmentContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { CompartmentApi } from "../api/CompartmentApi";
import {
  CompartmentCreateAndUpdateRequest,
  CompartmentDto,
  CompartmentSummaryDto,
} from "../types/Types";
import { useAuth } from "./AuthContext";

interface CompartmentContextType {
  compartments: CompartmentSummaryDto[];
  deviceId: number | null;
  fetchCompartments: () => Promise<void>;
  createCompartment: (data: CompartmentCreateAndUpdateRequest) => Promise<void>;
  updateCompartment: (data: CompartmentCreateAndUpdateRequest) => Promise<void>;
  deleteCompartment: (idx: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CompartmentContext = createContext<CompartmentContextType | undefined>(
  undefined
);

export const CompartmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [compartments, setCompartments] = useState<CompartmentSummaryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { deviceId } = useAuth();

  const fetchCompartments = async () => {
    if (!deviceId) {
      console.error("❌ DeviceId bulunamadı, compartments çekilemiyor");
      setError("Device ID bulunamadı.");
      return;
    }

    setLoading(true);
    try {
      console.log(
        "🔄 CompartmentContext: Auth context'den alınan deviceId:",
        deviceId
      );
      console.log("🔄 CompartmentContext: API çağrısı başlatılıyor...");

      const result = await CompartmentApi.getCompartmentsByDeviceId(deviceId);

      console.log("✅ CompartmentContext: API response alındı:", result);
      console.log("✅ CompartmentContext: Compartment sayısı:", result.length);

      setCompartments(result);
      setError(null);
    } catch (err: any) {
      const errorMsg = `Hazneler alınamadı: ${err.message || err}`;
      setError(errorMsg);
      console.error("❌ CompartmentContext Error fetching compartments:", err);
      console.error("❌ CompartmentContext Error message:", err.message);
      console.error(
        "❌ CompartmentContext Error response:",
        err.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  const createCompartment = async (data: CompartmentCreateAndUpdateRequest) => {
    try {
      await CompartmentApi.createCompartment(data);
      await fetchCompartments(); // Yeniden yükle
    } catch (err: any) {
      setError("Hazne oluşturulamadı.");
      console.error("Error creating compartment:", err);
    }
  };

  const updateCompartment = async (data: CompartmentCreateAndUpdateRequest) => {
    try {
      await CompartmentApi.updateCompartment(data);
      await fetchCompartments();
    } catch (err: any) {
      setError("Hazne güncellenemedi.");
      console.error("Error updating compartment:", err);
    }
  };

  const deleteCompartment = async (idx: number) => {
    if (!deviceId) {
      console.error("❌ DeviceId bulunamadı, compartment silinemez");
      setError("Device ID bulunamadı.");
      return;
    }

    try {
      await CompartmentApi.deleteCompartment(deviceId, idx);
      setCompartments((prev) =>
        prev.filter((compartment) => compartment.idx !== idx)
      );
    } catch (err: any) {
      setError("Hazne silinemedi.");
      console.error("Error deleting compartment:", err);
    }
  };

  return (
    <CompartmentContext.Provider
      value={{
        compartments,
        deviceId,
        fetchCompartments,
        createCompartment,
        updateCompartment,
        deleteCompartment,
        loading,
        error,
      }}
    >
      {children}
    </CompartmentContext.Provider>
  );
};

export const useCompartmentContext = (): CompartmentContextType => {
  const context = useContext(CompartmentContext);
  if (context === undefined) {
    throw new Error(
      "useCompartmentContext must be used within CompartmentProvider"
    );
  }
  return context;
};
