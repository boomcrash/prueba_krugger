import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_URL_BASE || "";

async function getServerToken() {
  return Cookies.get("token");
}

async function peticionUser(url: string, options: any = {}) {
  const token = await getServerToken();

  if (!token) {
    throw new Error("No hay token de autenticación");
  } else {
    console.log("Token obtenido:", token);
  }

  return fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

export async function getUser(id: number, options = {}): Promise<any> {
  try {
    const response = await peticionUser(`users/${id}`);
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      throw new Error("Error al obtener usuario");
    }
    
    const user = await response.json();
    return user;
  } catch (error) {
    throw error;
  }
}

export async function getUsers(options: Record<string, any> = {}): Promise<any> {
  try {
    const response = await peticionUser("users");
    console.log("Response status:", response.status);

    if (!response.ok) {
      return [];
    }

    const users = await response.json();
    return users;
  } catch (error) {
    return [];
  }
}

async function getAuthHeader() {
    const token = await Cookies.get("token");
    return token ? token : "";
}
export async function createUser(data: {
    username: string;
    email: string;
    password: string;
    role: string;
}, options = {}): Promise<any> {
  try {
    const response = await peticionUser("users", {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      throw new Error("Error al crear usuario");
    }
    
    const user = await response.json();
    return user;
  } catch (error) {
    throw error;
  }
}
