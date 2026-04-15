import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTemplates } from "@/services/templates.services";
import { updateUserSettings } from "@/services/settings.services";

export const useTemplates = () => {
    return useQuery({
        queryKey: ["invoice-templates"],
        queryFn: () => getTemplates(),
    });
}

export const useUpdateDefaultTemplate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (templateId: string) => updateUserSettings({ default_template_id: templateId }),
        onSuccess: (data) => {
            queryClient.setQueryData(["user-settings"], data);
        },
        onError: (error) => {
            console.error("Error updating default template:", error);
        },
    });
}
