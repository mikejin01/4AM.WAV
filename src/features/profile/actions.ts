"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/integrations/supabase/server";

export async function updatePhone(formData: FormData) {
  const phone = formData.get("phone") as string | null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      phone: phone?.trim() || null,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/profile");
  return { success: true, error: null };
}
