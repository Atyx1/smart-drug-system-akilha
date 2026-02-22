import apiClient from "./Client";
import { ActivityLogResponse, ActivityLogSearchCriteria } from "../types/Types";
import { formatISO } from "date-fns";

interface PageActivityLogResponse {
  content: ActivityLogResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface ActivityTypeInfo {
  name: string;
  description: string;
}

class LoggingApiClass {
  /**
   * Belirli bir tarih için günlük logları alma
   * @param date Tarih (Date nesnesi)
   * @returns
   */
  async getDailyLogs(date: Date): Promise<ActivityLogResponse[]> {
    const dateString = formatISO(date, { representation: "date" });

    try {
      const url = `/v1/logs/daily?date=${dateString}`;
      console.log("Günlük log isteği URL:", url);

      const response = await apiClient.get(url);
      console.log("Günlük log yanıtı:", response.data);

      return response.data;
    } catch (error) {
      console.error("Günlük loglar alınamadı:", error);
      throw error;
    }
  }

  /**
   * Cihaz aktivitelerini alma
   * @param date Tarih (Date nesnesi)
   * @returns
   */
  async getDeviceActivities(date: Date): Promise<ActivityLogResponse[]> {
    const dateString = formatISO(date, { representation: "date" });

    try {
      const url = `/v1/logs/device-activities?date=${dateString}`;
      console.log("Cihaz aktiviteleri isteği URL:", url);

      const response = await apiClient.get(url);
      console.log("Cihaz aktiviteleri yanıtı:", response.data);

      return response.data;
    } catch (error) {
      console.error("Cihaz aktiviteleri alınamadı:", error);
      throw error;
    }
  }

  /**
   * İlaç aktivitelerini alma
   * @param date Tarih (Date nesnesi)
   * @returns
   */
  async getPillActivities(date: Date): Promise<ActivityLogResponse[]> {
    const dateString = formatISO(date, { representation: "date" });

    try {
      const url = `/v1/logs/pill-activities?date=${dateString}`;
      console.log("İlaç aktiviteleri isteği URL:", url);

      const response = await apiClient.get(url);
      console.log("İlaç aktiviteleri yanıtı:", response.data);

      return response.data;
    } catch (error) {
      console.error("İlaç aktiviteleri alınamadı:", error);
      throw error;
    }
  }

  /**
   * Bildirim aktivitelerini alma
   * @param date Tarih (Date nesnesi)
   * @returns
   */
  async getNotificationActivities(date: Date): Promise<ActivityLogResponse[]> {
    const dateString = formatISO(date, { representation: "date" });

    try {
      const url = `/v1/logs/notification-activities?date=${dateString}`;
      console.log("Bildirim aktiviteleri isteği URL:", url);

      const response = await apiClient.get(url);
      console.log("Bildirim aktiviteleri yanıtı:", response.data);

      return response.data;
    } catch (error) {
      console.error("Bildirim aktiviteleri alınamadı:", error);
      throw error;
    }
  }

  /**
   * Tarih aralığı için logları alma
   * @param startDate Başlangıç tarihi
   * @param endDate Bitiş tarihi
   * @param category Kategori filtresi (optional: ALL, DEVICE, PILL, NOTIFICATION)
   * @returns
   */
  async getLogsForDateRange(
    startDate: Date,
    endDate: Date,
    category?: string
  ): Promise<ActivityLogResponse[]> {
    const startDateString = formatISO(startDate, { representation: "date" });
    const endDateString = formatISO(endDate, { representation: "date" });

    try {
      let url = `/v1/logs/date-range?startDate=${startDateString}&endDate=${endDateString}`;

      if (category && category !== "ALL") {
        url += `&category=${category}`;
      }

      console.log("Tarih aralığı logları isteği URL:", url);

      const response = await apiClient.get(url);
      console.log("Tarih aralığı logları yanıtı:", response.data);

      return response.data;
    } catch (error) {
      console.error("Tarih aralığı logları alınamadı:", error);
      throw error;
    }
  }

  /**
   * Aktivite tiplerini alma
   * @returns
   */
  async getActivityTypes(): Promise<ActivityTypeInfo[]> {
    try {
      const url = "/v1/logs/activity-types";
      console.log("Aktivite tipleri isteği URL:", url);

      const response = await apiClient.get(url);
      console.log("Aktivite tipleri yanıtı:", response.data);

      return response.data;
    } catch (error) {
      console.error("Aktivite tipleri alınamadı:", error);
      throw error;
    }
  }

  /**
   * Eski API metodları - geriye dönük uyumluluk için
   */
  async searchLogs(
    criteria: ActivityLogSearchCriteria,
    page: number = 0,
    size: number = 20
  ): Promise<PageActivityLogResponse> {
    try {
      // Basit bir arama implementasyonu - günlük logları kullan
      const logs = await this.getDailyLogs(new Date());

      // Manuel filtreleme
      let filteredLogs = logs;

      if (criteria.username) {
        filteredLogs = filteredLogs.filter((log) =>
          log.username?.toLowerCase().includes(criteria.username!.toLowerCase())
        );
      }

      if (criteria.actionType) {
        filteredLogs = filteredLogs.filter(
          (log) => log.actionType === criteria.actionType
        );
      }

      // Manuel sayfalama
      const totalElements = filteredLogs.length;
      const totalPages = Math.ceil(totalElements / size);
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const content = filteredLogs.slice(startIndex, endIndex);

      return {
        content,
        totalElements,
        totalPages,
        size,
        number: page,
        numberOfElements: content.length,
        first: page === 0,
        last: page >= totalPages - 1,
        empty: content.length === 0,
      };
    } catch (error: any) {
      console.error("Aktivite logları araması başarısız oldu:", error);
      throw error;
    }
  }
}

export const LoggingApi = new LoggingApiClass();
