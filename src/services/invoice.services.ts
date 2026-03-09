import { supabase } from "@/lib/supabase-client";
import type { Row } from "@/types/entries.types";

export const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(
      "There was an issue trying to retrieve the current users profile: ",
      error,
    );
  }

  return data;
};

export const fetchInvoices = async () => {
  const { data, error } = await supabase.from("invoices").select("*");

  if (error) {
    throw new Error(
      "There was an issue trying to retrieve the current users invoices: ",
      error,
    );
  }

  return data;
};

export const fetchInvoicesWithTotals = async () => {
  const { data, error } = await supabase
    .from("invoices_with_totals")
    .select("*")
    .order("invoice_number", { ascending: true });

  if (error) {
    throw new Error(
      "There was an issue when trying to retrieve all the invoices for the current user: " +
        error,
    );
  }

  return data;
};

export const fetchEntries = async () => {
  const { data, error } = await supabase.from("entries").select("*");

  if (error) {
    throw new Error(
      "There was an issue trying to retrieve the current users entries: ",
      error,
    );
  }

  return data;
};

export const saveInvoice = async (rows: Row[]) => {
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({})
    .select()
    .single();

  if (invoiceError) {
    return {
      success: false,
      error: invoiceError,
      message: "There was an issue creating an invoice",
      entires: null,
      invoices: null,
    };
  }

  const formattedRows = rows.map((row) => ({
    invoice_id: invoice.id,
    work_date: row.work_date,
    hours: row.hours,
    amount_owed: row.amount_owed,
    description: row.description,
  }));

  console.log(formattedRows);

  const { data: entries, error: entriesError } = await supabase
    .from("entries")
    .insert(formattedRows)
    .select();

  if (entriesError) {
    return {
      success: false,
      error: entriesError,
      message: "There was an issue creating the entries for the invoice",
      entries: null,
      invoice: null,
    };
  }

  return {
    success: true,
    message: "Successfully created new invoice",
    error: null,
    entries: entries,
    invoice: invoice,
  };
};
