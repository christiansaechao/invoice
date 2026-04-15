import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, getLogo, updateLogo } from "@/services/user.services";

export const useFetchProfile = (userId?: string) => {
    return useQuery({
        queryKey: ["fetch-profile", userId],
        queryFn: () => getProfile(userId!),
        enabled: !!userId,
    });
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, updates }: { userId: string, updates: any }) => updateProfile(userId, updates),
        onSuccess: (data, { userId }) => {
            queryClient.setQueryData(["fetch-profile", userId], data);
        },
    });
}

export const useLogo = (userId?: string) => {
    return useQuery({
        queryKey: ["logo", userId],
        queryFn: async () => {
            const data = await getLogo(userId!);
            return data.signedUrl;
        },
        enabled: !!userId,
    });
};

export const useLogoUpload = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ file, userId }: { file: File, userId: string }) => updateLogo(file, userId),
        onSuccess: (data) => {
            queryClient.setQueryData(["logo"], data);
        },
    });
}