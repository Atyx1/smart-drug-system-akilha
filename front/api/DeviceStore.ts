import * as SecureStore from "expo-secure-store";

export const getDeviceId = async (): Promise<number | null> => {
  try {
    const deviceIdStr = await SecureStore.getItemAsync("deviceId");
    if (!deviceIdStr) return null;
    return parseInt(deviceIdStr, 10);
  } catch (e) {
    console.error("Error retrieving device ID:", e);
    return null;
  }
};

export const setDeviceId = async (deviceId: number): Promise<void> => {
  try {
    await SecureStore.setItemAsync("deviceId", deviceId.toString());
    console.log("Device ID stored successfully:", deviceId);
  } catch (e) {
    console.error("Error storing device ID:", e);
  }
};
