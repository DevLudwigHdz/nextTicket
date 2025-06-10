"use client";

import { type UserWithProfile } from "@/types/app.types";

export default function AdminUsersList({
  initialUsers,
}: {
  initialUsers: UserWithProfile[];
}) {
  // Aquí podríamos añadir estados para filtros, paginación, etc.

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-MX", {
      dateStyle: "medium",
    });
  };

  const getRoleStyles = (role: "admin" | "promoter" | "attendee" | null) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "promoter":
        return "bg-blue-100 text-blue-800";
      case "attendee":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (initialUsers.length === 0) {
    return <p>No se encontraron usuarios.</p>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {initialUsers.map((user) => (
          <li key={user.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-indigo-600 truncate">
                  {user.full_name || "Sin Nombre"}
                </p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleStyles(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-700">
                    {user.users?.email || "Sin Email"}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-700 sm:mt-0">
                  <p>
                    Registrado: {formatDate(user.users?.created_at || null)}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
