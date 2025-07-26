"use client";
import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/infrastructure/api/ProjectApi";
import { Project } from "@/domain/project/ProjectTypes";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  // Insights
  const totalProjects = projects.length;
  const projectsThisMonth = projects.filter((p) => {
    const projectDate = new Date(p.createdAt);
    const currentDate = new Date();
    return (
      projectDate.getMonth() === currentDate.getMonth() &&
      projectDate.getFullYear() === currentDate.getFullYear()
    );
  }).length;
  const projectsPreviousMonths = projects.filter((p) => {
    const projectDate = new Date(p.createdAt);
    const currentDate = new Date();
    return (
      projectDate.getFullYear() < currentDate.getFullYear() ||
      (projectDate.getFullYear() === currentDate.getFullYear() &&
        projectDate.getMonth() < currentDate.getMonth())
    );
  }).length;

  // Filtros
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      new Date(p.createdAt).toLocaleDateString().includes(search);

    const matchesDate = dateFilter
      ? new Date(p.createdAt).toLocaleDateString().includes(dateFilter) ||
        new Date(p.createdAt).toISOString().substring(0, 10).includes(dateFilter)
      : true;

    return matchesSearch && matchesDate;
  });

  // Crear proyecto
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProject(form);
    setModalOpen(false);
    setForm({ name: "", description: "" });
    fetchProjects();
  };

  // Editar proyecto
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProject) {
      await updateProject(selectedProject.id, {
        name: form.name,
        description: form.description,
        state: "ACTIVE",
      });
      setEditModalOpen(false);
      setSelectedProject(null);
      setForm({ name: "", description: "" });
      fetchProjects();
    }
  };

  // Abrir modal editar
  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setForm({ name: project.name, description: project.description });
    setEditModalOpen(true);
  };

  // Eliminar proyecto
  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar este proyecto?")) {
      await deleteProject(id);
      fetchProjects();
    }
  };

  return (
    <section>
      {/* Insights dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-500">{totalProjects}</span>
          <span className="text-gray-700 mt-2 font-semibold">Total Proyectos</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-green-500">{projectsThisMonth}</span>
          <span className="text-gray-700 mt-2 font-semibold">Proyectos Este Mes</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-purple-500">{projectsPreviousMonths}</span>
          <span className="text-gray-700 mt-2 font-semibold">Proyectos Meses Anteriores</span>
        </div>
      </div>

      {/* Filtros y crear */}
      <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar proyecto o fecha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded text-black placeholder:text-gray-700"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border px-3 py-2 rounded text-black"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Limpiar fecha
            </button>
          )}
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setModalOpen(true)}
        >
          Crear proyecto
        </button>
      </div>

      {/* Cards de proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 relative">
            <h3 className="text-xl font-bold text-blue-600">{project.name}</h3>
            <p className="text-gray-800">{project.description}</p>
            <div className="text-sm text-gray-500">
              <span>Owner: {project.owner?.username || "Sin dueño"}</span>
            </div>
            <div className="text-sm text-gray-500">
              <span>Creado: {new Date(project.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => openEditModal(project)}
              >
                Editar
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(project.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-8">
            No hay proyectos.
          </div>
        )}
      </div>

      {/* Modal Crear Proyecto */}
      {modalOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-20 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
            <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Crear Proyecto</h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nombre del proyecto"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Proyecto */}
      {editModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-transparent bg-opacity-20 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
            <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Editar Proyecto</h3>
            <form onSubmit={handleEdit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nombre del proyecto"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => {
                    setEditModalOpen(false);
                    setSelectedProject(null);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
