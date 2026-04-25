import type { Database } from "./supabase";

export type Entries = Database["public"]["Tables"]["entries"]["Row"];

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
