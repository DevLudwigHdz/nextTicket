import { createSupabaseServerClientOnServer } from "./server";

export async function getUserProfile() {
  const supabase = await createSupabaseServerClientOnServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { session: null, profile: null };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116: 'exact-one' violation - no rows found
    console.error("Error fetching profile:", error);
    return { session, profile: null };
  }

  return { session, profile };
}
