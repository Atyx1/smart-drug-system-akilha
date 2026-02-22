// utils/jwtParser.ts
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";

export interface JwtPayload {
  sub: string; // içinde JSON string var
  role: string;
  iat: number;
}

export const getCurrentUserId = async (): Promise<number | null> => {
  const token = await SecureStore.getItemAsync("token");
  if (!token) return null;

  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    const sub = JSON.parse(decoded.sub);
    return sub.userId;
  } catch (e) {
    console.error("JWT parsing error:", e);
    return null;
  }
};
