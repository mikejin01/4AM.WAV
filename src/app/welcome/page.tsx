import { redirect } from "next/navigation";
import { createClient } from "@/lib/integrations/supabase/server";
import WelcomeContent from "@/features/welcome/WelcomeContent";

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const firstName = user.user_metadata?.full_name?.split(" ")[0] ?? "there";

  return <WelcomeContent name={firstName} />;
}
