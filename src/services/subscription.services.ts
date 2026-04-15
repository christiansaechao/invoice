import { supabase } from "@/lib/supabase-client";

export const getCurrentSubscription = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) return null;

  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("tier, status, billing_interval, cancel_at_period_end, current_period_end, magic_credits, stripe_customer_id")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`There was an issue getting your subscription: ${error.message}`);
  }

  return data;
};
