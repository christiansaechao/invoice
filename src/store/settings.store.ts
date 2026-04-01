import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BillToInfo = {
  manager: string;
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
};

export type SettingsState = {
  billTo: BillToInfo;
  setBillTo: (info: BillToInfo) => void;
  defaultClientId: string | null;
  setDefaultClientId: (id: string | null) => void;
};

const defaultBillTo: BillToInfo = {
  manager: "",
  companyName: "",
  addressLine1: "",
  addressLine2: "",
  phoneNumber: "",
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      billTo: defaultBillTo,
      setBillTo: (info) => set({ billTo: info }),
      defaultClientId: null,
      setDefaultClientId: (id) => set({ defaultClientId: id }),
    }),
    {
      name: "invoice-settings-storage",
    }
  )
);
