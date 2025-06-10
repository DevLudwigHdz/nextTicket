import Link from "next/link";
import { Suspense } from "react";
import MyEventsList from "@/components/dashboard/MyEventsList";

const EventsListSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default async function PromoterDashboardPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard de Promotor
          </h1>
          <Link href="/">
            <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Volver al Inicio
            </span>
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Bienvenido</h2>
          <p className="mt-1 text-gray-600">
            Desde aquí puedes gestionar tus eventos y ver tus ventas.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            Acciones Rápidas
          </h3>
          <div className="mt-4">
            <Link href="/dashboard/promoter/create">
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Crear Nuevo Evento
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Mis Eventos
          </h3>
          <Suspense fallback={<EventsListSkeleton />}>
            <MyEventsList />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
