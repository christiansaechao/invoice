import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPaymentsByInvoiceId,
  fetchInvoiceBalance,
  recordPayment,
  recordRefund,
} from "@/services/payment.services";

/**
 * Fetch all payments for a specific invoice.
 */
export const useFetchPayments = (invoiceId: string) => {
  return useQuery({
    queryKey: ["payments", invoiceId],
    queryFn: () => fetchPaymentsByInvoiceId(invoiceId),
    enabled: !!invoiceId,
  });
};

/**
 * Fetch the computed balance for an invoice.
 * Returns totalPaidCents, totalRefundedCents, balanceDueCents.
 */
export const useFetchInvoiceBalance = (invoiceId: string) => {
  return useQuery({
    queryKey: ["invoice-balance", invoiceId],
    queryFn: () => fetchInvoiceBalance(invoiceId),
    enabled: !!invoiceId,
  });
};

/**
 * Record a payment against an invoice.
 * Invalidates both the payments list and balance queries.
 */
export const useRecordPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordPayment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments", variables.invoiceId] });
      queryClient.invalidateQueries({ queryKey: ["invoice-balance", variables.invoiceId] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices-with-totals"] });
    },
  });
};

/**
 * Record a refund against an invoice.
 * Same invalidation pattern as payments.
 */
export const useRecordRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordRefund,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments", variables.invoiceId] });
      queryClient.invalidateQueries({ queryKey: ["invoice-balance", variables.invoiceId] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices-with-totals"] });
    },
  });
};
