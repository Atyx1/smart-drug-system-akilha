// api/ConnectWebSocket.ts
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getCurrentUserId } from "./JwtParser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showGlobalToast } from "@/components/toast/ToastManager";

let stomp: Client | null = null;
let connectionStatus: "disconnected" | "connecting" | "connected" | "error" =
  "disconnected";
let statusListeners: ((status: typeof connectionStatus) => void)[] = [];

// WebSocket bağlantı durumunu dinlemek için
export const addConnectionStatusListener = (
  listener: (status: typeof connectionStatus) => void
) => {
  statusListeners.push(listener);
  // Mevcut durumu hemen gönder
  listener(connectionStatus);

  // Cleanup function döndür
  return () => {
    statusListeners = statusListeners.filter((l) => l !== listener);
  };
};

export const getConnectionStatus = () => connectionStatus;

const updateConnectionStatus = (status: typeof connectionStatus) => {
  connectionStatus = status;
  statusListeners.forEach((listener) => listener(status));
};

// Bildirim durumunu kontrol et
const checkNotificationsEnabled = async (): Promise<boolean> => {
  try {
    const savedNotifications = await AsyncStorage.getItem(
      "notifications_enabled"
    );
    console.log("🔔 Bildirim durumu kontrol ediliyor:", savedNotifications);

    if (savedNotifications === null) {
      console.log("🔔 Bildirim ayarı bulunamadı, varsayılan: true");
      return true; // Varsayılan olarak açık
    }

    const isEnabled = JSON.parse(savedNotifications);
    console.log("🔔 Bildirim durumu:", isEnabled);
    return isEnabled;
  } catch (error) {
    console.error("🔔 Bildirim durumu kontrol edilirken hata:", error);
    return true; // Hata durumunda varsayılan olarak açık
  }
};

// Özel toast gösterme fonksiyonu
const showNotificationToast = async (
  type: "info" | "success" | "warning" | "error",
  title: string,
  message: string,
  duration: number
) => {
  console.log(`🔔 Bildirim gösterme isteği: ${type} - ${title}`);

  const notificationsEnabled = await checkNotificationsEnabled();
  console.log(`🔔 Bildirim durumu sonucu: ${notificationsEnabled}`);

  if (notificationsEnabled) {
    console.log(`🔔 Bildirim gösteriliyor: ${title}`);
    showGlobalToast({
      type,
      title,
      message,
      duration,
    });
  } else {
    console.log(`🔔 [NOTIFICATION_DISABLED] ${type}: ${title} - ${message}`);
  }
};

export const connectWebSocket = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  updateConnectionStatus("connecting");

  const sockJsUrl = "http://172.20.10.8:8080/api/ws";
  const socket = new SockJS(sockJsUrl);

  stomp = new Client({
    webSocketFactory: () => socket as WebSocket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("✅ STOMP bağlandı →", sockJsUrl);
      updateConnectionStatus("connected");

      // Çekmece bildirimleri - Info type
      stomp?.subscribe(`/topic/device/${userId}/compartment`, async (msg) => {
        const data = JSON.parse(msg.body);
        console.log("📦 Çekmece:", data);

        await showNotificationToast(
          "info",
          data.title || "İlaç Çekmece Bildirimi",
          data.body || "Çekmece işlemi gerçekleştirildi.",
          4000 // 8 saniye
        );
      });

      // HAP bildirimleri - Success type (daha kritik)
      stomp?.subscribe(`/topic/device/${userId}`, async (msg) => {
        const data = JSON.parse(msg.body);
        console.log("💊 HAP:", data);

        await showNotificationToast(
          "success",
          data.title || "İlaç Hatırlatması",
          data.body || "İlaç alma saatiniz geldi! Çekmecinizi kontrol edin.",
          4000 // 10 saniye - kritik bildirim
        );
      });

      // Sistem bildirimleri - Warning type
      stomp?.subscribe(`/topic/device/${userId}/system`, async (msg) => {
        const data = JSON.parse(msg.body);
        console.log("⚠️ Sistem:", data);

        await showNotificationToast(
          "warning",
          data.title || "Sistem Bildirimi",
          data.body || "Sistem ile ilgili önemli bir bildirim var.",
          4000 // 6 saniye
        );
      });
    },
    onStompError: (frame) => {
      console.error("STOMP hatası:", frame.headers["message"]);
      updateConnectionStatus("error");
    },
    onWebSocketError: (e) => {
      console.error("WS hatası:", e);
      updateConnectionStatus("error");
    },
    onDisconnect: () => {
      console.log("🔴 STOMP bağlantısı kesildi");
      updateConnectionStatus("disconnected");
    },
  });

  stomp.activate();
};

export const disconnectWebSocket = () => {
  if (stomp) {
    stomp.deactivate();
    stomp = null;
    updateConnectionStatus("disconnected");
    console.log("🔴 STOMP bağlantısı kapatıldı");
  }
};
