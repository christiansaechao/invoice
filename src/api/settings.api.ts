import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserSettings, updateUserSettings } from "@/services/settings.services";

export const useFetchUserSettings = () => {
    return useQuery({
        queryKey: ["user-settings"],
        queryFn: () => getUserSettings(),
    });
}

export const useUpdateUserSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updates: {
            default_client_id?: string | null;
            default_template_id?: string;
            logo_url?: string | null;
            payment_link?: string | null;
        }) => updateUserSettings(updates),
        onSuccess: (data) => {
            queryClient.setQueryData(["user-settings"], data);
        },
        onError: (error) => {
            console.error("Error updating user settings:", error);
        },
    });
}
