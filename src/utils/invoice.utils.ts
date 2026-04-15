import type { Row } from "@/types/entries.types";
import type { BillToInfo } from "@/store/settings.store";

export const createEmptyRow = (defaultDate?: string): Row => ({
  service_date: defaultDate || "",
  item_name: "",
  description: "",
  quantity: "",
  unit_price: "",
  amount: "",
  category: null,
});

export const updateRowInList = (
  rows: Row[],
  index: number,
  field: keyof Row,
  value: string
): Row[] => {
  const newRows = [...rows];
  newRows[index] = { ...newRows[index], [field]: value };
  return newRows;
};

export const addRowToList = (rows: Row[], defaultDate?: string): Row[] => {
  return [...rows, createEmptyRow(defaultDate)];
};

export const removeRowFromList = (rows: Row[], index: number): Row[] => {
  if (rows.length === 1) return rows; // Keep at least one row
  const newRows = [...rows];
  newRows.splice(index, 1);
  return newRows;
};

export const calculateAutoCalcRows = (
  rows: Row[],
  hourlyRate: string
): Row[] => {
  const rate = parseFloat(hourlyRate) || 0;
  return rows.map((row) => {
    const q = parseFloat(row.quantity) || 0;
    const p = parseFloat(row.unit_price) || rate;
    if (q && p) {
      return { ...row, amount: (q * p).toFixed(2) };
    }
    return row;
  });
};

export const calculateTotals = (
  rows: Row[],
  discountMode: "flat" | "percent" = "flat",
  discountValue: number = 0,
  taxRate: number = 0,
  taxAmount: number = 0
): { subtotal: number; discountAmt: number; total: number } => {
  const sub = rows.reduce((acc, row) => {
    const val = parseFloat(row.amount) || 0;
    return acc + val;
  }, 0);
  
  let computedDiscount = 0;
  if (discountMode === "flat") {
     computedDiscount = discountValue;
  } else if (discountMode === "percent") {
     computedDiscount = sub * (discountValue / 100);
  }
  
  const total = sub - computedDiscount + taxAmount;
  
  return { subtotal: sub, discountAmt: computedDiscount, total: total };
};

export const getBillToOverride = (
  selectedClient?: any
): BillToInfo | undefined => {
  if (!selectedClient) return undefined;

  return {
    manager: selectedClient.contact_name,
    companyName: selectedClient.company_name,
    addressLine1: selectedClient.address,
    addressLine2: `${selectedClient.city || ""} ${selectedClient.state || ""} ${selectedClient.zip_code || ""}`.trim(),
    phoneNumber: selectedClient.phone,
  };
};
