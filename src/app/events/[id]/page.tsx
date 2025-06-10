import { createSupabaseServerClientOnServer } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/supabase/get-user-profile";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PurchaseButton from "@/components/PurchaseButton";
import {
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  TicketIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

// Tipado para el evento con el perfil del organizador
type EventWithOrganizer = Awaited<ReturnType<typeof getEventById>>;

async function getEventById(id: string) {
  const supabase = await createSupabaseServerClientOnServer();
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      organizer:profiles (
        full_name
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching event ${id}:`, error);
    return null;
  }
  return data;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Fecha no disponible";
  return new Date(dateString).toLocaleString("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "UTC",
  });
};

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventById(params.id);
  const { profile, session } = await getUserProfile();

  if (!event) {
    notFound();
  }

  const isOrganizer = profile && profile.id === event.organizer_id;
  const ticketsAvailable =
    (event.total_tickets ?? 0) - (event.tickets_sold ?? 0);
  const isSoldOut = ticketsAvailable <= 0;

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="absolute top-0 left-0 p-6 z-10">
        <Link href="/events">
          <span className="text-indigo-600 hover:underline">
            &larr; Volver a todos los eventos
          </span>
        </Link>
      </header>

      <div className="relative h-96 w-full">
        <Image
          src={event.image_url || "/placeholder-event.jpg"}
          alt={`Banner del evento ${event.name}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      <div className="container mx-auto -mt-32 relative z-10 p-4 md:p-0">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="md:flex justify-between items-start">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                  {event.name}
                </h1>
                {event.organizer?.full_name && (
                  <p className="mt-2 text-lg text-gray-600 flex items-center">
                    <UserCircleIcon className="h-5 w-5 mr-2" /> Organizado por{" "}
                    {event.organizer.full_name}
                  </p>
                )}
              </div>
              {isOrganizer && (
                <div className="mt-4 md:mt-0">
                  <Link href={`/dashboard/promoter/edit/${event.id}`}>
                    {" "}
                    {/* Ruta de edición futura */}
                    <span className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                      Editar Evento
                    </span>
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-700">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-8 w-8 text-indigo-500" />
                <div>
                  <p className="font-bold">Fecha y Hora</p>
                  <p>{formatDate(event.date)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-8 w-8 text-indigo-500" />
                <div>
                  <p className="font-bold">Lugar</p>
                  <p>{event.location || "Por confirmar"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="h-8 w-8 text-indigo-500" />
                <div>
                  <p className="font-bold">Precio</p>
                  <p>${Number(event.ticket_price).toFixed(2)} MXN</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TicketIcon className="h-8 w-8 text-indigo-500" />
                <div>
                  <p className="font-bold">Boletos Disponibles</p>
                  <p>{ticketsAvailable > 0 ? ticketsAvailable : "Agotados"}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 prose max-w-none text-gray-800">
              <h2 className="text-2xl font-bold">Acerca del Evento</h2>
              <p>
                {event.description ||
                  "No hay una descripción detallada para este evento."}
              </p>
            </div>

            <div className="mt-12 text-center">
              {session ? (
                <PurchaseButton eventId={event.id} isSoldOut={isSoldOut} />
              ) : (
                <div>
                  <Link href={`/auth/login?next=/events/${event.id}`}>
                    <span className="inline-block w-full md:w-auto px-12 py-4 text-xl font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700">
                      Inicia sesión para comprar
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
