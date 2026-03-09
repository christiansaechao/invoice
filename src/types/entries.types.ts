export type Entries = {
  id: string;
  invoice_id: string;
  work_date: string;
  hours: number;
  amount_owed: number;
  description: string;
  created_at: string;
  updated_at: string;
};

export type Row = {
  work_date: string;
  description: string;
  hours: string;
  amount_owed: string;
};

export type InvoiceTableProps = {
  rows: Row[];
  updateRow: (index: number, field: keyof Row, value: string) => void;
};
