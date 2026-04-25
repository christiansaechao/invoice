import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchInvoices,
  fetchInvoicesWithTotals,
  fetchEntriesByInvoiceId,
  updateInvoiceEntries,
  saveInvoice,
  updateInvoiceStatus,
  updateFullInvoice,
  deleteInvoice,
  fetchInvoiceHistory,
} from "@/services/invoice.services";
import type { Row } from "@/types/entries.types";
import type { InvoiceStatus } from "@/types/invoice.types";
import type { InvoiceSavePayload } from "@/types/invoice-payload.types";

export const useFetchInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: () => fetchInvoices(),
  });
};

export const useFetchInvoicesWithTotals = () => {
  return useQuery({
    queryKey: ["invoices-with-totals"],
    queryFn: () => fetchInvoicesWithTotals(),
  });
};

export const useFetchEntriesByInvoiceId = (invoiceId: string) => {
  return useQuery({
    queryKey: ["entries", invoiceId],
    queryFn: () => fetchEntriesByInvoiceId(invoiceId),
    enabled: !!invoiceId,
  });
};

export const useSaveInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      rows: Row[];
      clientId: string;
      invoiceDate: string;
      dueDate: string;
      invoiceDetails: InvoiceSavePayload;
    }) =>
      saveInvoice(
        params.rows,
        params.clientId,
        params.invoiceDate,
        params.dueDate,
        params.invoiceDetails,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices-with-totals"] });
    },
  });
};

export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { invoiceId: string; status: InvoiceStatus }) =>
      updateInvoiceStatus(params.invoiceId, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices-with-totals"] });
    },
  });
};

export const useUpdateFullInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      invoiceId: string;
      clientId: string;
      invoiceNumber: string;
      rows: Row[];
      invoiceDate: string;
      dueDate: string;
      invoiceDetails: Partial<InvoiceSavePayload>;
    }) =>
      updateFullInvoice(
        params.invoiceId,
        params.clientId,
        params.invoiceNumber,
        params.rows,
        params.invoiceDate,
        params.dueDate,
        params.invoiceDetails,
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices-with-totals"] });
      queryClient.invalidateQueries({
        queryKey: ["entries", variables.invoiceId],
      });
    },
  });
};

export const useUpdateInvoiceEntries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { invoiceId: string; rows: Row[] }) =>
      updateInvoiceEntries(params.invoiceId, params.rows),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["entries", variables.invoiceId],
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices-with-totals"] });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invoiceId: string) => deleteInvoice(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices-with-totals"] });
    },
  });
};

export const useInvoiceHistory = (invoiceId: string) => {
  return useQuery({
    queryKey: ["invoice-history", invoiceId],
    queryFn: () => fetchInvoiceHistory(invoiceId),
    enabled: !!invoiceId,
  });
};
