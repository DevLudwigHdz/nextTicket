"use client";

import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Error de Autenticación
      </h1>
      <p className="text-lg text-gray-700 mb-2">
        Hubo un problema al intentar iniciar sesión. Por favor, inténtalo de
        nuevo.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Si el problema persiste, contacta con el soporte.
      </p>
      <Link href="/auth/login">
        <span className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
          Volver a la página de inicio de sesión
        </span>
      </Link>
    </div>
  );
}
