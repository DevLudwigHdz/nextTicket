"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Event } from "@/types/app.types";

// La acción del servidor se pasará como prop
type EventFormProps = {
  // eslint-disable-next-line no-unused-vars
  formAction: (
    formData: FormData
  ) => Promise<{ success: boolean; message: string; eventId?: string }>;
  event?: Event; // Para la edición futura
  buttonText?: string;
};

export default function EventForm({
  formAction,
  event,
  buttonText = "Crear Evento",
}: EventFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await formAction(formData);

    if (result.success) {
      // Redirigir a la página del evento recién creado o a la lista de eventos
      router.push(
        result.eventId ? `/events/${result.eventId}` : "/dashboard/promoter"
      );
      router.refresh(); // Asegura que la UI se actualice con los nuevos datos
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  // Convertir la fecha a formato yyyy-MM-ddTHH:mm para el input datetime-local
  const formatDateTimeForInput = (dateString?: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Ajustar por la zona horaria para que se muestre la hora local correcta en el input
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md"
    >
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre del Evento
        </label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={event?.name || ""}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Descripción
        </label>
        <textarea
          name="description"
          id="description"
          defaultValue={event?.description || ""}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha y Hora
          </label>
          <input
            type="datetime-local"
            name="date"
            id="date"
            defaultValue={formatDateTimeForInput(event?.date)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Lugar / Ciudad
          </label>
          <input
            type="text"
            name="location"
            id="location"
            defaultValue={event?.location || ""}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="total_tickets"
            className="block text-sm font-medium text-gray-700"
          >
            Total de Boletos
          </label>
          <input
            type="number"
            name="total_tickets"
            id="total_tickets"
            min="0"
            defaultValue={event?.total_tickets || 0}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label
            htmlFor="ticket_price"
            className="block text-sm font-medium text-gray-700"
          >
            Precio del Boleto (MXN)
          </label>
          <input
            type="number"
            name="ticket_price"
            id="ticket_price"
            min="0"
            step="0.01"
            defaultValue={event?.ticket_price || "0.00"}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="image_url"
          className="block text-sm font-medium text-gray-700"
        >
          URL de la Imagen Promocional
        </label>
        <input
          type="url"
          name="image_url"
          id="image_url"
          defaultValue={event?.image_url || ""}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Guardando..." : buttonText}
        </button>
      </div>
    </form>
  );
}
