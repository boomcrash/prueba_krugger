import jwtDecode from "jwt-decode";
import { DecodedToken } from "@/domain/auth/AuthTypes";

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
}
