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
  start_date: z.string().min(1, "Start date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_date: z.string().min(1, "End date is required"),
  end_time: z.string().min(1, "End time is required"),
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
    start_date: formData.get("start_date") as string,
    start_time: formData.get("start_time") as string,
    end_date: formData.get("end_date") as string,
    end_time: formData.get("end_time") as string,
    ticket_url: formData.get("ticket_url") as string,
  };

  const result = createEventSchema.safeParse(raw);
  if (!result.success) {
    const firstError = result.error.issues[0];
    return { error: firstError.message };
  }

  const data = result.data;

  const startsAt = new Date(`${data.start_date}T${data.start_time}`);
  const endsAt = new Date(`${data.end_date}T${data.end_time}`);

  if (isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) {
    return { error: "Invalid date or time." };
  }

  const { error: dbError } = await supabase.from("events").insert({
    title: data.title,
    description: data.description || null,
    image_url: data.image_url || null,
    venue_name: data.venue_name,
    venue_address: data.venue_address,
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    ticket_url: data.ticket_url || null,
    created_by: user.id,
  });

  if (dbError) {
    return { error: dbError.message };
  }

  redirect("/events");
}
