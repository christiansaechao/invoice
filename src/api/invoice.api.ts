import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchInvoices, fetchInvoicesWithTotals } from "@/services/invoice.services";

export const useFetchInvoices = () => {
    return useQuery({
        queryKey: ["invoices"],
        queryFn: () => fetchInvoices(),
    });
}

export const useFetchInvoicesWithTotals = () => {
    return useQuery({
        queryKey: ["invoices-with-totals"],
        queryFn: () => fetchInvoicesWithTotals(),
    });
}