import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/features/auth/dal";
import ProfileContent from "@/features/profile/ProfileContent";
import type { Profile } from "@/features/profile/types";

export default async function ProfilePage() {
  const user = await verifySession();
  const supabase = await createClient();

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
    <ProfileContent
      user={{ name, email, avatar }}
      phone={profile?.phone ?? null}
      membershipTier={profile?.membership_tier ?? "free"}
    />
  );
}
