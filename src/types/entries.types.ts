export type Entries = {
  id: string;
  invoice_id: string;
  service_date: string;
  quantity: number;
  amount: number;
  description: string;
  created_at: string;
  updated_at: string;
  item_name: string;
  unit_price: number;
  category?: string | null;
};

export type Row = {
  service_date: string;
  item_name: string;
  description: string;
  quantity: string;
  unit_price: string;
  amount: string;
  category: "Labor" | "Materials" | null;
};

export type InvoiceTableProps = {
  rows: Row[];
  updateRow: (index: number, field: keyof Row, value: string) => void;
};
