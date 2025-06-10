import { getUserProfile } from "@/lib/supabase/get-user-profile";
import { createSupabaseServerClientOnServer } from "@/lib/supabase/server";
import { type Event } from "@/types/app.types";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

async function getPromoterEvents(userId: string): Promise<Event[]> {
  const supabase = await createSupabaseServerClientOnServer();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", userId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching promoter events:", error);
    return [];
  }
  return data;
}

export default async function MyEventsList() {
  const { profile } = await getUserProfile();

  if (!profile) {
    return (
      <p className="text-red-500">
        No se pudo cargar tu perfil. Por favor, intenta de nuevo.
      </p>
    );
  }

  const events = await getPromoterEvents(profile.id);

  if (events.length === 0) {
    return (
      <div className="text-center bg-white p-8 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">
          No has creado ningún evento todavía.
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          ¡Empieza creando tu primer evento para que aparezca aquí!
        </p>
        <div className="mt-6">
          <Link href="/dashboard/promoter/create">
            <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              Crear Primer Evento
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {events.map((event) => (
          <li key={event.id}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between flex-wrap">
              <div className="flex-1 min-w-0 pr-4">
                <Link href={`/events/${event.id}`} className="block">
                  <p className="text-md font-medium text-indigo-600 truncate">
                    {event.name}
                  </p>
                </Link>
                <p className="mt-2 flex items-center text-sm text-gray-500">
                  {new Date(event.date!).toLocaleDateString("es-MX", {
                    dateStyle: "long",
                    timeZone: "UTC",
                  })}
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center space-x-4 mt-4 sm:mt-0">
                <p className="text-sm text-gray-900">
                  ${Number(event.ticket_price).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  {event.tickets_sold || 0} / {event.total_tickets} vendidos
                </p>
              </div>
              <div className="ml-5 flex-shrink-0 flex items-center space-x-2 mt-4 sm:mt-0">
                <Link href={`/dashboard/promoter/edit/${event.id}`}>
                  <span
                    className="p-2 rounded-full hover:bg-gray-200"
                    title="Editar Evento"
                  >
                    <PencilIcon
                      className="h-5 w-5 text-gray-500"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
                <form action={"#" /* Futura server action */}>
                  <input type="hidden" name="eventId" value={event.id} />
                  <button
                    type="submit"
                    className="p-2 rounded-full hover:bg-red-100"
                    title="Eliminar Evento"
                  >
                    <TrashIcon
                      className="h-5 w-5 text-red-600"
                      aria-hidden="true"
                    />
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
