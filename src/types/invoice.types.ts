export type Invoices = {
  id: string;
  profile_id: string;
  invoice_number: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type InvoicesWithTotals = {
  id: string;
  invoice_number: number;
  created_at: string;
  updated_at: string;
  completed: boolean;
  total_amount_owed: number;
};
