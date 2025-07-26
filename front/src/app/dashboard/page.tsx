"use client";
import { useEffect, useState } from "react";
import { getProjects } from "@/infrastructure/api/ProjectApi";
import { getUsers } from "@/infrastructure/api/UserApi";
import { Project } from "@/domain/project/ProjectTypes";
import { User } from "@/domain/user/UserTypes";
import { decodeToken } from "@/utils/jwt";
import Cookies from "js-cookie";
import { FaUsers, FaProjectDiagram, FaCalendarAlt } from "react-icons/fa";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUserRole(decoded.roles[0] || "");
        setUsername(decoded.sub || "");
      }
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    const projectsData = await getProjects();
    setProjects(projectsData);
    
    // Obtener usuarios para todos los roles
    const usersData = await getUsers();
    setUsers(usersData);
  };

  // Estadísticas generales
  const totalProjects = projects.length;
  const myProjects = projects.filter(p => p.owner?.username === username).length;
  const projectsThisMonth = projects.filter(p => {
    const projectDate = new Date(p.createdAt);
    const currentDate = new Date();
    return projectDate.getMonth() === currentDate.getMonth() && 
           projectDate.getFullYear() === currentDate.getFullYear();
  }).length;

  // Estadísticas de admin
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === "ADMIN").length;
  const regularUsers = users.filter(u => u.role === "USER").length;

  // Proyectos recientes
  const recentProjects = projects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center">
        <h1 className="text-3xl font-bold">
          {userRole === "ADMIN" ? "Dashboard Administrativo" : "Dashboard de Usuario"}
        </h1>
        <p className="text-blue-100 mt-2">
          {userRole === "ADMIN" 
            ? "Resumen general de la plataforma, usuarios y proyectos del sistema"
            : "Vista personalizada de tus proyectos y estadísticas de trabajo"
          }
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center min-h-[140px]">
            <FaUsers className="text-4xl text-blue-500 mb-3" />
            <span className="text-4xl font-bold text-blue-500">{totalUsers}</span>
            <span className="text-gray-700 mt-2 font-semibold text-lg">Total Usuarios</span>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center min-h-[140px]">
            <FaProjectDiagram className="text-4xl text-green-500 mb-3" />
            <span className="text-4xl font-bold text-green-500">{myProjects}</span>
            <span className="text-gray-700 mt-2 font-semibold text-lg">Mis Proyectos</span>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center min-h-[140px]">
            <FaCalendarAlt className="text-4xl text-purple-500 mb-3" />
            <span className="text-4xl font-bold text-purple-500">{projectsThisMonth}</span>
            <span className="text-gray-700 mt-2 font-semibold text-lg">Este Mes</span>
          </div>
        </div>
      </div>

      {/* Estadísticas de Admin */}
      {userRole === "ADMIN" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Proyectos</h3>
            <div className="text-center">
              <span className="text-3xl font-bold text-orange-500">{totalProjects}</span>
              <p className="text-gray-600 mt-2">En la plataforma</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución de Usuarios</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Administradores:</span>
                <span className="font-semibold text-blue-600">{adminUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Usuarios regulares:</span>
                <span className="font-semibold text-green-600">{regularUsers}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Proyectos sin Owner</h3>
            <div className="text-center">
              <span className="text-3xl font-bold text-red-500">
                {projects.filter(p => !p.owner).length}
              </span>
              <p className="text-gray-600 mt-2">Requieren asignación</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Gráficos de Tareas</h3>
            <div className="text-center py-8 text-gray-400">
              <p>Próximamente</p>
              <p className="text-sm">Estadísticas de tareas</p>
            </div>
          </div>
        </div>
      )}

      {/* Proyectos recientes */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Proyectos Recientes</h3>
        {recentProjects.length > 0 ? (
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-800">{project.name}</h4>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {project.owner?.username || "Sin owner"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No hay proyectos disponibles</p>
          </div>
        )}
      </div>

      {/* Espacio para gráficos de tareas (Solo para usuarios regulares) */}
      {userRole !== "ADMIN" && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Mis Estadísticas de Tareas</h3>
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Próximamente</p>
            <p>Gráficos y estadísticas de tus tareas</p>
          </div>
        </div>
      )}
    </section>
  );
}

