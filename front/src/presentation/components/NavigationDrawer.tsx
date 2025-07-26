"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaUser, FaProjectDiagram, FaTasks, FaBars, FaHome } from "react-icons/fa"; // iconos

type Props = {
  roles: string[];
};

const navItems = [
  {
    label: "Home",
    path: "/dashboard",
    role: "ANY",
    icon: <FaHome />,
  },
  {
    label: "Usuarios",
    path: "/dashboard/users",
    role: "ROLE_ADMIN",
    icon: <FaUser />,
  },
  {
    label: "Proyectos",
    path: "/dashboard/projects",
    role: "ANY",
    icon: <FaProjectDiagram />,
  },
  { label: "Tareas", path: "/dashboard/tasks", role: "ANY", icon: <FaTasks /> },
];

export default function NavigationDrawer({ roles }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAdmin = roles.includes("ROLE_ADMIN");

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gray-100 transition-all shadow-lg z-50 ${open ? "w-48" : "w-16"
        }`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        {open ? (
          <span className="w-full text-center font-semibold text-gray-700 text-lg">Menú</span>
        ) : (
          <FaBars className="text-2xl text-gray-600" />
        )}
      </div>
      <nav className="flex flex-col mt-4">
        {navItems
          .filter(
            (item) =>
              item.role === "ANY" || (item.role === "ROLE_ADMIN" && isAdmin)
          )
          .map((item) => (
            <button
              key={item.path}
              className={`flex items-center gap-3 text-left px-4 py-2 my-1 rounded transition-all duration-200 ${pathname === item.path
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-100 text-gray-800"
                }`}
              onClick={() => router.push(item.path)}
            >
              <span className="text-xl">{item.icon}</span>
              <span
                className={`whitespace-nowrap transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"
                  }`}
              >
                {item.label}
              </span>
            </button>
          ))}
      </nav>
    </aside>
  );
}
