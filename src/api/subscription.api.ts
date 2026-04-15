import { useQuery } from "@tanstack/react-query";
import { getCurrentSubscription } from "@/services/subscription.services";

export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: ["current-subscription"],
    queryFn: () => getCurrentSubscription(),
  });
};
