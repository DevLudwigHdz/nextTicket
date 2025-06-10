import EventForm from "@/components/forms/EventForm";
import { createEvent } from "@/app/actions/eventActions";
import Link from "next/link";

export default function CreateEventPage() {
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard/promoter"
            className="text-sm text-indigo-600 hover:underline"
          >
            &larr; Volver al Dashboard de Promotor
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Crear un Nuevo Evento
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Completa los siguientes campos para publicar tu evento en la
            plataforma.
          </p>
        </div>
        <EventForm formAction={createEvent} />
      </div>
    </div>
  );
}
