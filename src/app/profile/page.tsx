import { redirect } from "next/navigation";
import { createClient } from "@/lib/integrations/supabase/server";
import Navbar from "@/components/layout/Navbar";
import ProfileContent from "@/features/profile/ProfileContent";
import type { Profile } from "@/features/profile/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, phone, membership_tier, updated_at")
    .eq("id", user.id)
    .single<Profile>();

  const name =
    user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User";
  const email = user.email ?? "";
  const avatar: string | null = user.user_metadata?.avatar_url ?? null;

  return (
    <>
      <Navbar />
      <ProfileContent
        user={{ name, email, avatar }}
        phone={profile?.phone ?? null}
        membershipTier={profile?.membership_tier ?? "free"}
      />
    </>
  );
}
