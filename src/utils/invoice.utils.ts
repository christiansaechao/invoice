import type { Row } from "@/types/entries.types";
import type { BillToInfo } from "@/store/settings.store";

export const createEmptyRow = (defaultDate?: string): Row => ({
  work_date: defaultDate || "",
  description: "",
  hours: "",
  amount_owed: "",
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
    const h = parseFloat(row.hours) || 0;
    if (h && rate) {
      return { ...row, amount_owed: (h * rate).toFixed(2) };
    }
    return row;
  });
};

export const calculateTotals = (
  rows: Row[]
): { subtotal: number; total: number } => {
  const sub = rows.reduce((acc, row) => {
    const val = parseFloat(row.amount_owed) || 0;
    return acc + val;
  }, 0);
  return { subtotal: sub, total: sub }; // extend logic for discount/tax later
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
