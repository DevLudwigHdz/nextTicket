"use server";

import { createSupabaseServerClientOnServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Esta función es una "Server Action". Se ejecuta de forma segura en el servidor.
export async function createEvent(formData: FormData) {
  const supabase = await createSupabaseServerClientOnServer();

  // 1. Verificar si el usuario está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      message: "No autenticado. Por favor, inicia sesión.",
    };
  }

  // 2. Extraer y validar los datos del formulario
  const rawData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    date: formData.get("date") as string, // Se recibe como string
    location: formData.get("location") as string,
    total_tickets: parseInt(formData.get("total_tickets") as string, 10),
    ticket_price: parseFloat(formData.get("ticket_price") as string),
    image_url: formData.get("image_url") as string,
  };

  if (
    !rawData.name ||
    !rawData.date ||
    isNaN(rawData.total_tickets) ||
    isNaN(rawData.ticket_price)
  ) {
    return {
      success: false,
      message:
        "Faltan campos obligatorios o los datos numéricos son inválidos.",
    };
  }

  // Convertir la fecha a formato ISO 8601 con zona horaria (UTC)
  const eventDate = new Date(rawData.date).toISOString();

  // 3. Insertar en la base de datos
  // La RLS que configuramos antes se encargará de verificar si el usuario tiene rol 'promoter' o 'admin'.
  // También asignamos el 'organizer_id' al usuario actual.
  const { data: newEvent, error } = await supabase
    .from("events")
    .insert({
      name: rawData.name,
      description: rawData.description,
      date: eventDate,
      location: rawData.location,
      total_tickets: rawData.total_tickets,
      ticket_price: rawData.ticket_price,
      image_url: rawData.image_url,
      organizer_id: user.id, // ¡Importante! Asignar el evento al usuario actual.
    })
    .select()
    .single(); // .select().single() para obtener el registro insertado

  if (error) {
    console.error("Error creating event:", error);
    // Mensaje de error más amigable basado en el código de error de Postgres/Supabase
    if (error.code === "23503") {
      // Foreign key violation
      return {
        success: false,
        message:
          "Error de referencia. Asegúrate de que tu perfil de usuario esté completo.",
      };
    }
    if (error.code === "42501") {
      // row-level security policy violation
      return {
        success: false,
        message: "No tienes los permisos necesarios para crear un evento.",
      };
    }
    return {
      success: false,
      message: `Error en la base de datos: ${error.message}`,
    };
  }

  // 4. Revalidar el caché de las páginas afectadas para que muestren el nuevo evento
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath(`/events/${newEvent.id}`);

  // 5. Devolver éxito
  return {
    success: true,
    message: "Evento creado con éxito",
    eventId: newEvent.id,
  };
}
