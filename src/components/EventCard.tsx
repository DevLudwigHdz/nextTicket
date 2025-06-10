import Link from "next/link";
import Image from "next/image";
import { type Event } from "@/types/app.types";

interface EventCardProps {
  event: Event;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Fecha no disponible";
  return new Date(dateString).toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC", // Importante para consistencia entre servidor y cliente
  });
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer h-full flex flex-col group">
        <div className="relative h-48 w-full">
          <Image
            src={event.image_url || "/placeholder-event.jpg"}
            alt={`Imagen promocional para ${event.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
              {event.name}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {event.description}
            </p>
            <div className="text-sm text-gray-500 space-y-2">
              <p>
                <strong>Fecha:</strong> {formatDate(event.date)}
              </p>
              <p>
                <strong>Lugar:</strong>{" "}
                {event.location || "Ubicación por confirmar"}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-xl font-semibold text-indigo-600">
              ${Number(event.ticket_price).toFixed(2)} MXN
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
