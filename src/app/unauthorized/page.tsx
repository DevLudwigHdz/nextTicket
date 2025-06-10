import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
      <p className="text-xl text-gray-700 mb-2">
        No tienes los permisos necesarios para ver esta página.
      </p>
      <p className="text-md text-gray-500 mb-8">
        Si crees que esto es un error, por favor contacta al administrador del
        sitio.
      </p>
      <Link href="/">
        <span className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
          Volver al Inicio
        </span>
      </Link>
    </div>
  );
}
