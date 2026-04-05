export type MembershipTier = "free" | "vip";

export type Profile = {
  id: string;
  phone: string | null;
  membership_tier: MembershipTier;
  updated_at: string;
};
