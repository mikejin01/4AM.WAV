import { verifySession } from "@/features/auth/dal";
import WelcomeContent from "@/features/welcome/WelcomeContent";

export default async function WelcomePage() {
  const user = await verifySession();
  const firstName = user.user_metadata?.full_name?.split(" ")[0] ?? "there";

  return <WelcomeContent name={firstName} />;
}
