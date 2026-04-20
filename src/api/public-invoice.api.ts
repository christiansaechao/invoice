import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPublicInvoice, convertQuote } from "@/services/public-invoice.service";

/**
 * Fetch a public invoice/quote document by ID.
 * Enabled only when `id` is defined. Returns loading/error/data states.
 */
export function usePublicInvoice(id: string | undefined) {
  return useQuery({
    queryKey: ["public-invoice", id],
    queryFn: () => fetchPublicInvoice(id!),
    enabled: !!id,
    retry: (failureCount, error: Error) => {
      // Don't retry 404s
      if (error.message === "Document not found") return false;
      return failureCount < 2;
    },
    staleTime: 30_000,
  });
}

/**
 * Convert a quote document into a live invoice.
 * On success, invalidates the public-invoice cache so the page re-fetches
 * and updates from "quote" → "invoice" state.
 */
export function useConvertQuote(id: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => convertQuote(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-invoice", id] });
    },
  });
}
