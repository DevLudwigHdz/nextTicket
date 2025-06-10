import { type TicketWithEvent } from "@/types/app.types";
import {
  CalendarDaysIcon,
  MapPinIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Fecha no disponible";
  return new Date(dateString).toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

export default function TicketCard({ ticket }: { ticket: TicketWithEvent }) {
  const { events: event } = ticket;

  if (!event) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-red-600">Error en el Boleto</h3>
        <p className="text-gray-600">
          No se pudo cargar la información del evento asociado a este boleto
          (ID: {ticket.id.substring(0, 8)}).
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row transition-shadow hover:shadow-xl">
      <div className="relative w-full md:w-1/3 h-48 md:h-auto">
        <Image
          src={event.image_url || "/placeholder-event.jpg"}
          alt={`Imagen de ${event.name}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{event.name}</h3>
          <p className="text-gray-500 text-sm mt-1">
            Boleto ID: {ticket.id.substring(0, 8)}
          </p>
          <div className="mt-4 space-y-3 text-gray-700">
            <div className="flex items-center">
              <CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-500" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
              <span>{event.location || "Ubicación por confirmar"}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-lg font-semibold text-indigo-600">
            {ticket.seat_info || "Entrada General"}
          </p>
          <button className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
            <QrCodeIcon className="h-5 w-5 mr-2" />
            Mostrar QR
          </button>
        </div>
      </div>
    </div>
  );
}
