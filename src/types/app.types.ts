import type { Database } from "./database.types";

export type Event = Database["public"]["Tables"]["events"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type TicketWithEvent = Database["public"]["Tables"]["tickets"]["Row"] & {
  events: Pick<
    Database["public"]["Tables"]["events"]["Row"],
    "name" | "date" | "location" | "image_url"
  > | null;
};
export type UserWithProfile = Profile & {
  users: Pick<
    Database["auth"]["Tables"]["users"]["Row"],
    "email" | "created_at"
  > | null;
};
