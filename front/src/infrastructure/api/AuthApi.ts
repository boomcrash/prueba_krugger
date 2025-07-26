import axios from "axios";
import { LoginPayload, AuthResponse } from "@/domain/auth/AuthTypes";

const BASE_URL = process.env.NEXT_PUBLIC_URL_BASE || "";
console.log("BASE_URL:", BASE_URL);
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await axios.post(`${BASE_URL}auth/login`, payload);
  return res.data;
}
