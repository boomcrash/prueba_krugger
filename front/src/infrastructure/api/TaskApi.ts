import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_URL_BASE || "";

async function getServerToken() {
  return Cookies.get("token");
}

async function peticionTask(url: string, options: any = {}) {
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

export async function getTasks(options = {}): Promise<any> {
  try {
    const response = await peticionTask("tasks");

    if (!response.ok) {
      return [];
    }

    const tasks = await response.json();
    return tasks;
  } catch (error) {
    return [];
  }
}

export async function getTasksByProject(projectId: number, options = {}): Promise<any> {
  try {
    const response = await peticionTask(`tasks/project/${projectId}`);

    if (!response.ok) {
      return [];
    }

    const tasks = await response.json();
    return tasks;
  } catch (error) {
    return [];
  }
}

export async function createTask(
  data: {
    title: string;
    description: string;
    status: string;
    assignedToId: number;
    projectId: number;
    dueDate: string;
  },
  options = {}
): Promise<any> {
  try {
    // Convertir fecha a datetime si no es un ISO string completo
    const processedData = {
      ...data,
      dueDate: data.dueDate.includes("T")
        ? data.dueDate
        : new Date(data.dueDate).toISOString(),
    };

    const response = await peticionTask("tasks", {
      method: "POST",
      body: JSON.stringify(processedData),
    });

    if (!response.ok) {
      throw new Error("Error al crear tarea");
    }

    const task = await response.json();
    return task;
  } catch (error) {
    throw error;
  }
}

export async function updateTask(
  id: number,
  data: any,
  options = {}
): Promise<any> {
  try {
    // Convertir fecha a datetime si existe y no es un ISO string completo
    const processedData = {
      ...data,
      ...(data.dueDate &&
        !data.dueDate.includes("T") && {
          dueDate: new Date(data.dueDate).toISOString(),
        }),
    };

    const response = await peticionTask(`tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(processedData),
    });

    if (!response.ok) {
      throw new Error("Error al editar tarea");
    }

    const task = await response.json();
    return task;
  } catch (error) {
    throw error;
  }
}

export async function deleteTask(id: number, options = {}): Promise<any> {
  try {
    const response = await peticionTask(`tasks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar tarea");
    }

    const deletedTask = await response.json();
    return deletedTask;
  } catch (error) {
    throw error;
  }
}
