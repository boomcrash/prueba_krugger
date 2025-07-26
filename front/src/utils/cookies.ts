import Cookies from "js-cookie";

export function setTokenCookie(token: string) {
  Cookies.set("token", token, { secure: true, sameSite: "strict" });
}

export function getTokenCookie(): string | undefined {
  return Cookies.get("token");
}

export function removeTokenCookie() {
  Cookies.remove("token");
}
