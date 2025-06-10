"use server";

import { createSupabaseServerClientOnServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function purchaseTicketAction(eventId: string) {
  const supabase = await createSupabaseServerClientOnServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      message: "Debes iniciar sesión para comprar un boleto.",
    };
  }

  // Llamar a la función RPC de la base de datos
  // No necesitamos pasar el user_id porque la función SQL lo obtiene de auth.uid()
  const { data, error } = await supabase.rpc("purchase_ticket", {
    p_event_id: eventId,
  });

  if (error) {
    console.error("RPC Error:", error);
    return {
      success: false,
      message: "Ocurrió un error en el servidor. Por favor, intenta más tarde.",
    };
  }

  // La función RPC devuelve una sola fila en un array
  const result = data[0];

  if (result.success) {
    // Si la compra fue exitosa, revalidar las rutas para que la UI se actualice
    // en todos lados (contador de boletos, lista de "Mis Boletos", etc.)
    revalidatePath(`/events/${eventId}`);
    revalidatePath("/dashboard/my-tickets");
  }

  // Devolver el resultado (éxito o fracaso con mensaje) al cliente
  return result;
}
