"use client";
import { useEffect, useState } from "react";
import { getProjects } from "@/infrastructure/api/ProjectApi";
import { getUsers } from "@/infrastructure/api/UserApi";
import { getTasks, createTask, updateTask, deleteTask, getTasksByProject } from "@/infrastructure/api/TaskApi";
import { Project } from "@/domain/project/ProjectTypes";
import { User } from "@/domain/user/UserTypes";
import { Task } from "@/domain/task/TaskTypes";
import { decodeToken } from "@/utils/jwt";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function TasksPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<"assign" | "view">("assign");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "PENDING",
    assignedToId: 0,
    dueDate: "",
  });
  const [viewAssignmentsModal, setViewAssignmentsModal] = useState(false);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "PENDING",
    dueDate: "",
  });
  const [editingMyTaskId, setEditingMyTaskId] = useState<number | null>(null);
  const [myTaskStatus, setMyTaskStatus] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUsername(decoded.sub || "");
      }
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    const projectsData = await getProjects();
    const usersData = await getUsers();
    const tasksData = await getTasks();
    
    setProjects(projectsData);
    setUsers(usersData);
    setTasks(tasksData);
  };

  const myProjects = projects.filter(p => p.owner?.username === username);
  const myTasks = tasks.filter(t => {
    const assignedUser = users.find(u => u.id === t.assignedToId);
    return assignedUser?.username === username;
  });
  const otherUsers = users.filter(u => u.username !== username);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProjectId) {
      // Convertir fecha a formato datetime
      const dueDatetime = new Date(form.dueDate).toISOString();
      
      await createTask({
        ...form,
        assignedToId: Number(form.assignedToId),
        projectId: selectedProjectId,
        dueDate: dueDatetime,
      });
      setModalOpen(false);
      setForm({
        title: "",
        description: "",
        status: "PENDING",
        assignedToId: 0,
        dueDate: "",
      });
      fetchData();
    }
  };

  const openModal = (projectId: number) => {
    setSelectedProjectId(projectId);
    setModalOpen(true);
  };

  const openAssignmentsModal = async (projectId: number, projectName: string) => {
    setSelectedProjectId(projectId); // Asegurar que el ID se guarde
    setSelectedProjectName(projectName);
    const tasks = await getTasksByProject(projectId);
    setProjectTasks(tasks);
    setViewAssignmentsModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditForm({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate.split('T')[0], // Convertir datetime a date
    });
  };

  const handleUpdateTask = async (taskId: number) => {
    try {
      await updateTask(taskId, {
        ...editForm,
        dueDate: new Date(editForm.dueDate).toISOString(),
      });
      setEditingTaskId(null);
      // Usar el ID del proyecto correcto
      if (selectedProjectId) {
        const tasks = await getTasksByProject(selectedProjectId);
        setProjectTasks(tasks);
      }
      fetchData(); // Refrescar datos generales
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Seguro que deseas eliminar esta tarea?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteTask(taskId);
        // Usar el ID del proyecto correcto
        if (selectedProjectId) {
          const tasks = await getTasksByProject(selectedProjectId);
          setProjectTasks(tasks);
        }
        fetchData(); // Refrescar datos generales
        
        Swal.fire({
          title: '¡Eliminado!',
          text: 'La tarea ha sido eliminada exitosamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error("Error al eliminar tarea:", error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar la tarea.',
          icon: 'error'
        });
      }
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditForm({
      title: "",
      description: "",
      status: "PENDING",
      dueDate: "",
    });
  };

  const handleEditMyTask = (task: Task) => {
    setEditingMyTaskId(task.id);
    setMyTaskStatus(task.status);
  };

  const handleUpdateMyTaskStatus = async (taskId: number) => {
    try {
      await updateTask(taskId, {
        status: myTaskStatus,
      });
      setEditingMyTaskId(null);
      setMyTaskStatus("");
      fetchData(); // Refrescar datos generales
      
      Swal.fire({
        title: '¡Actualizado!',
        text: 'El estado de la tarea ha sido actualizado exitosamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error al actualizar estado de tarea:", error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar el estado de la tarea.',
        icon: 'error'
      });
    }
  };

  const cancelMyTaskEdit = () => {
    setEditingMyTaskId(null);
    setMyTaskStatus("");
  };

  // Obtener fecha mínima válida
  const getMinDate = () => {
    const today = new Date().toISOString().split('T')[0];
    if (selectedProjectId) {
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        const projectDate = new Date(project.createdAt).toISOString().split('T')[0];
        return projectDate > today ? projectDate : today;
      }
    }
    return today;
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-black">Gestión de Tareas</h2>
      
      {/* Botones de navegación */}
      <div className="flex justify-center gap-4">
        <button
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === "assign"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("assign")}
        >
          Asignar Tareas a Otros
        </button>
        <button
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === "view"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("view")}
        >
          Ver Mis Tareas Asignadas
        </button>
      </div>

      {/* Contenido dinámico */}
      {activeTab === "assign" && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Mis Proyectos - Asignar Tareas</h3>
          {myProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr className="bg-gray-100 text-black">
                    <th className="py-2 px-4 text-left">Proyecto</th>
                    <th className="py-2 px-4 text-left">Descripción</th>
                    <th className="py-2 px-4 text-left">Fecha Creación</th>
                    <th className="py-2 px-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {myProjects.map((project) => (
                    <tr key={project.id} className="border-b text-black">
                      <td className="py-2 px-4 font-semibold">{project.name}</td>
                      <td className="py-2 px-4">{project.description}</td>
                      <td className="py-2 px-4">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                            onClick={() => openModal(project.id)}
                          >
                            Asignar Tarea
                          </button>
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                            onClick={() => openAssignmentsModal(project.id, project.name)}
                          >
                            Ver Asignaciones
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-lg">No tienes proyectos creados</p>
              <p>Debes crear un proyecto para poder asignar tareas</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "view" && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Mis Tareas Asignadas</h3>
          {myTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTasks.map((task) => (
                <div key={task.id} className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-800 mb-2">{task.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  
                  {editingMyTaskId === task.id ? (
                    <div className="space-y-3">
                      <select
                        value={myTaskStatus}
                        onChange={(e) => setMyTaskStatus(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm text-blue-600"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateMyTaskStatus(task.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={cancelMyTaskEdit}
                          className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                        <span
                          className={`px-2 py-1 rounded ${
                            task.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : task.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {task.status}
                        </span>
                        <span>Vence: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => handleEditMyTask(task)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                        >
                          Cambiar Estado
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-lg">No tienes tareas asignadas</p>
              <p>Cuando te asignen tareas aparecerán aquí</p>
            </div>
          )}
        </div>
      )}

      {/* Modal para crear tarea */}
      {modalOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-20 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
            <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Asignar Nueva Tarea</h3>
            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Título de la tarea"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border border-gray-300 px-4 py-3 rounded-lg text-blue-600 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <textarea
                placeholder="Descripción"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border border-gray-300 px-4 py-3 rounded-lg text-blue-600 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none h-24"
                required
              />
              <select
                value={form.assignedToId}
                onChange={(e) => setForm({ ...form, assignedToId: Number(e.target.value) })}
                className="border border-gray-300 px-4 py-3 rounded-lg text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value={0}>Seleccionar usuario</option>
                {otherUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                min={getMinDate()}
                className="border border-gray-300 px-4 py-3 rounded-lg text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                >
                  Asignar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ver Asignaciones */}
      {viewAssignmentsModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-20 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-200 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Asignaciones del Proyecto: {selectedProjectName}
              </h3>
              <button
                onClick={() => setViewAssignmentsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            {projectTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectTasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 rounded-lg p-4 border">
                    {editingTaskId === task.id ? (
                      // Formulario de edición
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full border border-gray-300 px-3 py-2 rounded text-sm text-blue-600 placeholder:text-gray-600"
                          placeholder="Título"
                        />
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full border border-gray-300 px-3 py-2 rounded text-sm h-20 resize-none text-blue-600 placeholder:text-gray-600"
                          placeholder="Descripción"
                        />
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          className="w-full border border-gray-300 px-3 py-2 rounded text-sm text-blue-600"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="DONE">DONE</option>
                        </select>
                        <input
                          type="date"
                          value={editForm.dueDate}
                          onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                          className="w-full border border-gray-300 px-3 py-2 rounded text-sm text-blue-600"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateTask(task.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Vista normal
                      <>
                        <h4 className="font-semibold text-gray-800 mb-2">{task.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                        <div className="mb-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              task.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : task.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                          Vence: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          Asignado a: {users.find(u => u.id === task.assignedToId)?.username || "N/A"}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                          >
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Este proyecto no tiene tareas asignadas</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
