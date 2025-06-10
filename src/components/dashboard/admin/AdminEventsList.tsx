"use client";

import { type Event } from "@/types/app.types";
import Link from "next/link";

export default function AdminEventsList({
  initialEvents,
}: {
  initialEvents: Event[];
}) {
  if (initialEvents.length === 0) {
    return <p>No se encontraron eventos en la plataforma.</p>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {initialEvents.map((event) => (
          <li key={event.id}>
            <Link
              href={`/events/${event.id}`}
              className="block hover:bg-gray-50"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {event.name}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {event.tickets_sold || 0} / {event.total_tickets} vendidos
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-700">
                      {event.location || "Sin ubicación"}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-700 sm:mt-0">
                    <p>
                      Fecha: {new Date(event.date!).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
