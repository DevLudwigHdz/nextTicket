import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// ¡Importante! Este cliente es solo para acciones de administrador en el lado del servidor.
// Utiliza la clave service_role y nunca debe ser expuesto al cliente/navegador.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  // En un entorno de producción, es posible que desees manejar esto de forma más elegante.
  throw new Error(
    "Faltan las variables de entorno de Supabase (URL o Service Role Key)."
  );
}

// Creamos un cliente de Supabase que utiliza la clave de servicio para tener privilegios de administrador.
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      // Para un cliente de admin, no necesitamos refrescar tokens ni persistir sesiones.
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
