import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDefaultClient, setDefaultClient } from "@/services/client.services";
import { fetchClients, createClient } from "@/services/invoice.services";

export const useFetchDefaultClient = () => {
    return useQuery({
        queryKey: ["default-client"],
        queryFn: () => getDefaultClient(),
    });
}

export const useSetDefaultClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (clientId: string) => setDefaultClient(clientId),
        onSuccess: (data) => {
            queryClient.setQueryData(["default-client"], data);
        },
        onError: (error) => {
            console.error("Error setting default client:", error);
        },
    });
}

export const useFetchClients = () => {
    return useQuery({
        queryKey: ["clients"],
        queryFn: () => fetchClients(),
    });
}

export const useCreateClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (clientData: any) => createClient(clientData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}
