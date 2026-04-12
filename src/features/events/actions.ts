"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const createEventSchema = z.object({
  title: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  image_url: z.string().url("Must be a valid URL").or(z.literal("")),
  venue_name: z.string().min(1, "Venue name is required"),
  venue_address: z.string().min(1, "Address is required"),
  starts_at: z.string().min(1, "Start date/time is required"),
  ends_at: z.string().min(1, "End date/time is required"),
  ticket_url: z.string().url("Must be a valid URL").or(z.literal("")),
});

export async function createEvent(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create an event." };
  }

  const raw = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    image_url: formData.get("image_url") as string,
    venue_name: formData.get("venue_name") as string,
    venue_address: formData.get("venue_address") as string,
    starts_at: formData.get("starts_at") as string,
    ends_at: formData.get("ends_at") as string,
    ticket_url: formData.get("ticket_url") as string,
  };

  const result = createEventSchema.safeParse(raw);
  if (!result.success) {
    const firstError = result.error.issues[0];
    return { error: firstError.message };
  }

  const data = result.data;

  const { error: dbError } = await supabase.from("events").insert({
    title: data.title,
    description: data.description || null,
    image_url: data.image_url || null,
    venue_name: data.venue_name,
    venue_address: data.venue_address,
    starts_at: new Date(data.starts_at).toISOString(),
    ends_at: new Date(data.ends_at).toISOString(),
    ticket_url: data.ticket_url || null,
    created_by: user.id,
  });

  if (dbError) {
    return { error: dbError.message };
  }

  redirect("/events");
}
