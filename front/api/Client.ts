// src/services/api/client.ts
import { ApiResponse } from "@/types/Types";
import axios, { AxiosError, AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";

const getToken = async () => {
  try {
    return await SecureStore.getItemAsync("token");
  } catch (error) {
    console.error("Token getting error:", error);
    return null;
  }
};

const getDeviceId = async () => {
  try {
    return await SecureStore.getItemAsync("deviceId");
  } catch (error) {
    console.error("DeviceId getting error:", error);
    return null;
  }
};

const apiClient: AxiosInstance = axios.create({
  baseURL: "http://192.168.1.12:8080/api",

  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add deviceId as a custom header if available
    const deviceId = await getDeviceId();
    if (deviceId && config.headers) {
      config.headers["X-Device-ID"] = deviceId;
    }

    // Log requests for debugging
    console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
      params: config.params,
    });

    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor'ı güncelleme
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(
      `✅ Response from ${response.config.url}:`,
      response.status,
      response.data
    );
    return response;
  },
  (error: AxiosError) => {
    // Log error responses
    console.error(
      `❌ Error from ${error.config?.url}:`,
      error.response?.status,
      error.response?.data
    );

    // Hata nesnesini doğrudan reddetmek, daha fazla bilgi sağlar.
    // Böylece, .catch() bloğunda error.response.data gibi detaylara erişebiliriz.
    return Promise.reject(error);
  }
);

export default apiClient;
