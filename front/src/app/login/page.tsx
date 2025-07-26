"use client";
import { useState } from "react";
import { login } from "@/infrastructure/api/AuthApi";
import { setTokenCookie } from "@/utils/cookies";
import { decodeToken } from "@/utils/jwt";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // importar SweetAlert2
import "sweetalert2/dist/sweetalert2.min.css"; // importar estilos

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login({ username, password });
      console.log("Login response:", res);
      setTokenCookie(res.token);
      const decoded = decodeToken(res.token);
      if (!decoded) throw new Error("Token inválido");
      await Swal.fire({
        icon: "success",
        title: "¡Ingreso exitoso!",
        text: "Bienvenido al sistema.",
        timer: 1000,
        showConfirmButton: false,
      });
      router.push("/dashboard");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Credenciales incorrectas",
        text: "Verifica tu usuario y contraseña.",
        timer: 1000,
        showConfirmButton: false,
      });
      setError("Credenciales incorrectas");
    }
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-50">
      <form
        className="bg-gray-100 p-8 rounded-xl border border-gray-300 shadow-2xl w-80 flex flex-col gap-4"
        style={{
          boxShadow:
            "0 16px 32px rgba(37,99,235,0.18), 0 4px 16px rgba(0,0,0,0.10)",
          transform: "translateY(-12px) scale(1.03)",
        }}
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-2 text-center text-black">
          Iniciar sesión
        </h1>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded px-3 py-2 placeholder:text-gray-700 text-blue-800"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2 placeholder:text-gray-700 text-blue-800"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Entrar
        </button>
        {error && <span className="text-red-500">{error}</span>}
      </form>
    </main>
  );
}
