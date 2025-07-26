"use client";
import { removeTokenCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { decodeToken } from "@/utils/jwt";
import Cookies from "js-cookie";

type Props = {
  username: string;
};

export default function Header({ username }: Props) {
  const router = useRouter();
  const [actualUsername, setActualUsername] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setActualUsername(decoded.sub || "Usuario");
      }
    }
  }, []);

  const handleLogout = () => {
    removeTokenCookie();
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center p-3 border-b bg-gray-200">
      <span className="text-lg font-semibold text-blue-500">
        Bienvenido {actualUsername}
      </span>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={handleLogout}
      >
        Salir
      </button>
    </header>
  );
}
