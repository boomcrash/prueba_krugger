import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_URL_BASE || "";

async function getServerToken() {
  return Cookies.get("token");
}

async function peticionProject(url: string, options: any = {}) {
  const token = await getServerToken();

  if (!token) {
    throw new Error("No hay token de autenticación");
  }else{
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

export async function getProjects(options = {}): Promise<any> {
  try {
    const response = await peticionProject("projects");

    if (!response.ok) {
      return [];
    }

    const projects = await response.json();
    return projects;
  } catch (error) {
    return [];
  }
}

export async function createProject(
  data: { name: string; description: string },
  options = {}
): Promise<any> {
  try {
    const response = await peticionProject("projects", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al crear proyecto");
    }

    const project = await response.json();
    return project;
  } catch (error) {
    throw error;
  }
}

export async function updateProject(
  id: number,
  data: any,
  options = {}
): Promise<any> {
  try {
    const response = await peticionProject(`projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al editar proyecto");
    }

    const project = await response.json();
    return project;
  } catch (error) {
    throw error;
  }
}

export async function deleteProject(id: number, options = {}): Promise<any> {
  try {
    const response = await peticionProject(`projects/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar proyecto");
    }

    const deletedProject = await response.json();
    return deletedProject;
  } catch (error) {
    throw error;
  }
}