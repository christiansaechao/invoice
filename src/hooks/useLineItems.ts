import { useState } from "react";
import type { Row } from "@/types/entries.types";
import {
  createEmptyRow,
  updateRowInList,
  addRowToList,
  removeRowFromList,
  calculateAutoCalcRows,
} from "@/utils/invoice.utils";

export function useLineItems(initialRows: Row[] = [createEmptyRow()]) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [hourlyRate, setHourlyRate] = useState("");

  const updateRow = (index: number, field: keyof Row, value: string) => {
    setRows(prev => {
        let newList = updateRowInList(prev, index, field, value);
        if (field === 'quantity' || field === 'unit_price') {
             newList = calculateAutoCalcRows(newList, hourlyRate); 
        }
        return newList;
    });
  };

  const setHourlyRateReactive = (val: string) => {
    setHourlyRate(val);
    setRows(prev => calculateAutoCalcRows(prev, val));
  };

  const addRow = () => {
    setRows(prev => {
      // Find the most recent date used across the current rows loop (top or bottom element depending on sorts)
      let recentDate = "";
      if (prev.length > 0) {
        // Find first valid string
        const validRows = prev.filter(r => r.service_date);
        recentDate = validRows.length > 0 ? validRows[0].service_date : "";
      }
      return addRowToList(prev, recentDate);
    });
  };

  const removeRow = (index: number) => {
    setRows(prev => removeRowFromList(prev, index));
  };

  return {
    rows,
    hourlyRate,
    setRows,
    setHourlyRate: setHourlyRateReactive,
    updateRow,
    addRow,
    removeRow
  };
}
