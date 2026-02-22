import React, { createContext, useContext, useState, useCallback } from "react";
import {
  ActivityLogResponse,
  ActivityLogSearchCriteria,
  ActivityType,
} from "../types/Types";
import { LoggingApi } from "../api/LoggingApi";
import { subDays, startOfDay, endOfDay, formatISO, format } from "date-fns";

import { tr } from "date-fns/locale";

// ActivitySummaryDTO tipi tanımlanmadığı için local olarak tanımlıyoruz
interface ActivitySummaryDTO {
  totalLogs: number;
  successCount: number;
  errorCount: number;
  userCount: number;
  storeCount: number;
}

interface ActivityTypeInfo {
  name: string;
  description: string;
}

interface LoggingContextType {
  // Durum değişkenleri
  logs: ActivityLogResponse[];
  deviceLogs: ActivityLogResponse[];
  pillLogs: ActivityLogResponse[];
  notificationLogs: ActivityLogResponse[];
  activityTypes: ActivityTypeInfo[];
  summary: ActivitySummaryDTO | null;
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  selectedDate: Date;
  dateRangeLogs: ActivityLogResponse[];

  // İşlev metotları
  searchLogs: (
    criteria: ActivityLogSearchCriteria,
    page?: number,
    size?: number
  ) => Promise<void>;
  getDailyLogs: (date: Date) => Promise<void>;
  getDeviceActivities: (date: Date) => Promise<void>;
  getPillActivities: (date: Date) => Promise<void>;
  getNotificationActivities: (date: Date) => Promise<void>;
  getLogsForDateRange: (
    startDate: Date,
    endDate: Date,
    category?: string
  ) => Promise<void>;
  getActivityTypes: () => Promise<void>;
  getActivitySummary: (startDate?: Date, endDate?: Date) => Promise<void>;
  clearLogs: () => void;
  setSelectedDate: (date: Date) => void;

  // Yardımcı metotlar
  getActivityTypeDescription: (type: string) => string;
  formatTimestamp: (timestamp: string) => string;
  refreshCurrentData: () => Promise<void>;
}

const defaultSummary: ActivitySummaryDTO = {
  totalLogs: 0,
  successCount: 0,
  errorCount: 0,
  userCount: 0,
  storeCount: 0,
};

// Default enum değerleri için yardımcı
const getDefaultActivityTypes = (): ActivityTypeInfo[] => {
  return Object.values(ActivityType).map((type) => ({
    name: type,
    description: type.replace(/_/g, " ").toLowerCase(),
  }));
};

const LoggingContext = createContext<LoggingContextType | undefined>(undefined);

export const LoggingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Durum değişkenleri
  const [logs, setLogs] = useState<ActivityLogResponse[]>([]);
  const [deviceLogs, setDeviceLogs] = useState<ActivityLogResponse[]>([]);
  const [pillLogs, setPillLogs] = useState<ActivityLogResponse[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<
    ActivityLogResponse[]
  >([]);
  const [dateRangeLogs, setDateRangeLogs] = useState<ActivityLogResponse[]>([]);
  const [activityTypes, setActivityTypes] = useState<ActivityTypeInfo[]>([]);
  const [summary, setSummary] = useState<ActivitySummaryDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Yükleme durumu ile API çağrısı yapmak için yardımcı fonksiyon
  const runWithLoading = useCallback(
    async <T,>(
      apiFn: () => Promise<T>,
      onSuccess: (data: T) => void,
      onError: (err: any) => void
    ) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFn();
        onSuccess(result);
      } catch (err: any) {
        console.error("API çağrısı hatası:", err);
        onError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Günlük logları alma
  const getDailyLogs = useCallback(
    async (date: Date) => {
      const apiCall = () => LoggingApi.getDailyLogs(date);

      const handleSuccess = (logsData: ActivityLogResponse[]) => {
        console.log("Context: getDailyLogs yanıtı alındı", logsData);

        if (Array.isArray(logsData)) {
          console.log("Günlük loglar:", logsData);
          setLogs(logsData);
          setTotalElements(logsData.length);
          setTotalPages(1);
          setCurrentPage(0);
        } else {
          console.error("API yanıtı geçersiz format:", logsData);
          setError("Geçersiz API yanıtı formatı");
          setLogs([]);
        }
      };

      const handleError = (err: any) => {
        setError(err.message || "Günlük loglar alınamadı");
        setLogs([]);
      };

      console.log("Context: getDailyLogs çağrıldı", date);
      await runWithLoading(apiCall, handleSuccess, handleError);
    },
    [runWithLoading]
  );

  // Cihaz aktivitelerini alma
  const getDeviceActivities = useCallback(
    async (date: Date) => {
      const apiCall = () => LoggingApi.getDeviceActivities(date);

      const handleSuccess = (logsData: ActivityLogResponse[]) => {
        console.log("Context: getDeviceActivities yanıtı alındı", logsData);

        if (Array.isArray(logsData)) {
          setDeviceLogs(logsData);
        } else {
          console.error("API yanıtı geçersiz format:", logsData);
          setError("Geçersiz API yanıtı formatı");
          setDeviceLogs([]);
        }
      };

      const handleError = (err: any) => {
        setError(err.message || "Cihaz aktiviteleri alınamadı");
        setDeviceLogs([]);
      };

      await runWithLoading(apiCall, handleSuccess, handleError);
    },
    [runWithLoading]
  );

  // İlaç aktivitelerini alma
  const getPillActivities = useCallback(
    async (date: Date) => {
      const apiCall = () => LoggingApi.getPillActivities(date);

      const handleSuccess = (logsData: ActivityLogResponse[]) => {
        console.log("Context: getPillActivities yanıtı alındı", logsData);

        if (Array.isArray(logsData)) {
          setPillLogs(logsData);
        } else {
          console.error("API yanıtı geçersiz format:", logsData);
          setError("Geçersiz API yanıtı formatı");
          setPillLogs([]);
        }
      };

      const handleError = (err: any) => {
        setError(err.message || "İlaç aktiviteleri alınamadı");
        setPillLogs([]);
      };

      await runWithLoading(apiCall, handleSuccess, handleError);
    },
    [runWithLoading]
  );

  // Bildirim aktivitelerini alma
  const getNotificationActivities = useCallback(
    async (date: Date) => {
      const apiCall = () => LoggingApi.getNotificationActivities(date);

      const handleSuccess = (logsData: ActivityLogResponse[]) => {
        console.log(
          "Context: getNotificationActivities yanıtı alındı",
          logsData
        );

        if (Array.isArray(logsData)) {
          setNotificationLogs(logsData);
        } else {
          console.error("API yanıtı geçersiz format:", logsData);
          setError("Geçersiz API yanıtı formatı");
          setNotificationLogs([]);
        }
      };

      const handleError = (err: any) => {
        setError(err.message || "Bildirim aktiviteleri alınamadı");
        setNotificationLogs([]);
      };

      await runWithLoading(apiCall, handleSuccess, handleError);
    },
    [runWithLoading]
  );

  // Tarih aralığı için logları alma
  const getLogsForDateRange = useCallback(
    async (startDate: Date, endDate: Date, category?: string) => {
      const apiCall = () =>
        LoggingApi.getLogsForDateRange(startDate, endDate, category);

      const handleSuccess = (logsData: ActivityLogResponse[]) => {
        console.log("Context: getLogsForDateRange yanıtı alındı", logsData);

        if (Array.isArray(logsData)) {
          setDateRangeLogs(logsData);
        } else {
          console.error("API yanıtı geçersiz format:", logsData);
          setError("Geçersiz API yanıtı formatı");
          setDateRangeLogs([]);
        }
      };

      const handleError = (err: any) => {
        setError(err.message || "Tarih aralığı logları alınamadı");
        setDateRangeLogs([]);
      };

      console.log(
        "Context: getLogsForDateRange çağrıldı",
        startDate,
        endDate,
        category
      );
      await runWithLoading(apiCall, handleSuccess, handleError);
    },
    [runWithLoading]
  );

  // Aktivite tiplerini alma
  const getActivityTypes = useCallback(async () => {
    const apiCall = () => LoggingApi.getActivityTypes();

    const handleSuccess = (typesData: ActivityTypeInfo[]) => {
      console.log("Context: getActivityTypes yanıtı alındı", typesData);

      if (typesData && typesData.length > 0) {
        console.log("Aktivite tipleri:", typesData);
        setActivityTypes(typesData);
      } else {
        console.error("API yanıtında tip bulunamadı:", typesData);
        setActivityTypes(getDefaultActivityTypes());
      }
    };

    const handleError = () => {
      console.error(
        "Aktivite tipleri alınamadı, varsayılan değerler kullanılıyor"
      );
      setActivityTypes(getDefaultActivityTypes());
    };

    console.log("Context: getActivityTypes çağrıldı");
    await runWithLoading(apiCall, handleSuccess, handleError);
  }, [runWithLoading]);

  // Aktivite özetini alma (API'de tanımlı değil, boş implementation)
  const getActivitySummary = useCallback(
    async (startDate?: Date, endDate?: Date) => {
      console.log(
        "Context: getActivitySummary çağrıldı (devre dışı)",
        startDate,
        endDate
      );
      // API'de tanımlı olmadığı için varsayılan özet set ediyoruz
      setSummary(defaultSummary);
    },
    []
  );

  // Tüm güncel verileri yenileme
  const refreshCurrentData = useCallback(async () => {
    await Promise.all([
      getDailyLogs(selectedDate),
      getDeviceActivities(selectedDate),
      getPillActivities(selectedDate),
      getNotificationActivities(selectedDate),
      // getActivitySummary(selectedDate, selectedDate), // API'de tanımlı değil, kaldırıldı
    ]);
  }, [
    selectedDate,
    getDailyLogs,
    getDeviceActivities,
    getPillActivities,
    getNotificationActivities,
    // getActivitySummary, // Kaldırıldı
  ]);

  // Aktivite loglarını arama (geriye dönük uyumluluk)
  const searchLogs = useCallback(
    async (
      criteria: ActivityLogSearchCriteria,
      page: number = 0,
      size: number = 20
    ) => {
      const apiCall = () => LoggingApi.searchLogs(criteria, page, size);

      const handleSuccess = (pageData: any) => {
        console.log("Context: searchLogs yanıtı alındı", pageData);

        if (pageData && pageData.content) {
          console.log(
            "Loglar:",
            pageData.content,
            "Toplam:",
            pageData.totalElements
          );

          // Eğer sayfa 0'dan büyükse, mevcut loglara yeni logları ekle
          if (page > 0) {
            setLogs((prevLogs) => [...prevLogs, ...pageData.content]);
          } else {
            // İlk sayfa ise direk setle
            setLogs(pageData.content);
          }

          setTotalElements(pageData.totalElements || 0);
          setTotalPages(pageData.totalPages || 0);
          setCurrentPage(page);
        } else {
          console.error("API yanıtı geçersiz format:", pageData);
          setError("Geçersiz API yanıtı formatı");
          if (page === 0) {
            setLogs([]);
          }
        }
      };

      const handleError = (err: any) => {
        setError(err.message || "Aktivite logları alınamadı");
        if (page === 0) {
          setLogs([]);
        }
      };

      console.log("Context: searchLogs çağrıldı", criteria, page, size);
      await runWithLoading(apiCall, handleSuccess, handleError);
    },
    [runWithLoading]
  );

  // Logları temizleme
  const clearLogs = useCallback(() => {
    console.log("Context: clearLogs çağrıldı");
    setLogs([]);
    setDeviceLogs([]);
    setPillLogs([]);
    setNotificationLogs([]);
    setDateRangeLogs([]);
    setSummary(null);
    setError(null);
    setTotalElements(0);
    setTotalPages(0);
    setCurrentPage(0);
  }, []);

  // Aktivite tipi açıklaması alma
  const getActivityTypeDescription = useCallback(
    (type: string): string => {
      console.log("Context: getActivityTypeDescription çağrıldı", type);
      const found = activityTypes.find((t) => t.name === type);
      if (found) {
        return found.description;
      }

      // Eğer bulunamazsa, basit bir dönüşüm yap
      return type.replace(/_/g, " ").toLowerCase();
    },
    [activityTypes]
  );

  // Zaman damgası formatlama
  const formatTimestamp = useCallback((timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return format(date, "dd/MM/yyyy HH:mm:ss", { locale: tr });
    } catch (error) {
      console.error("Zaman damgası formatlanamadı:", timestamp, error);
      return timestamp;
    }
  }, []);

  // Context değeri
  const contextValue: LoggingContextType = {
    logs,
    deviceLogs,
    pillLogs,
    notificationLogs,
    dateRangeLogs,
    activityTypes,
    summary,
    loading,
    error,
    totalElements,
    totalPages,
    currentPage,
    selectedDate,

    searchLogs,
    getDailyLogs,
    getDeviceActivities,
    getPillActivities,
    getNotificationActivities,
    getLogsForDateRange,
    getActivityTypes,
    getActivitySummary,
    clearLogs,
    setSelectedDate,

    getActivityTypeDescription,
    formatTimestamp,
    refreshCurrentData,
  };

  return (
    <LoggingContext.Provider value={contextValue}>
      {children}
    </LoggingContext.Provider>
  );
};

export const useLogging = () => {
  const context = useContext(LoggingContext);
  if (context === undefined) {
    throw new Error("useLogging must be used within a LoggingProvider");
  }
  return context;
};
