import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDefaultClient,
  setDefaultClient,
  updateClient,
  archiveClient,
} from "@/services/client.services";
import { fetchClients, createClient } from "@/services/invoice.services";

export const useFetchDefaultClient = () => {
  return useQuery({
    queryKey: ["default-client"],
    queryFn: () => getDefaultClient(),
  });
};

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
};

export const useFetchClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(),
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientData: any) => createClient(clientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      clientId,
      clientData,
    }: {
      clientId: string;
      clientData: any;
    }) => {
      const res = await updateClient(clientId, clientData);
      if (!res.success) {
        throw new Error(res.error || "Failed to update client");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["default-client"] });
    },
  });
};

export const useArchiveClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      clientId,
      isArchived,
    }: {
      clientId: string;
      isArchived: boolean;
    }) => {
      const res = await archiveClient(clientId, isArchived);
      if (!res.success) {
        throw new Error(res.error || "Failed to archive client");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["default-client"] });
    },
  });
};
