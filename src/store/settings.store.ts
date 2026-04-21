import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BillToInfo = {
  manager: string;
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
};

export type Theme = "light" | "dark" | "system";

export type SettingsState = {
  billTo: BillToInfo;
  setBillTo: (info: BillToInfo) => void;
  defaultClientId: string | null;
  setDefaultClientId: (id: string | null) => void;
  defaultTemplateId: string;
  setDefaultTemplateId: (id: string) => void;
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
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
      setBillTo: (info: BillToInfo) => set({ billTo: info }),
      defaultClientId: null,
      setDefaultClientId: (id: string | null) => set({ defaultClientId: id }),
      defaultTemplateId: "standard",
      setDefaultTemplateId: (id: string) => set({ defaultTemplateId: id }),
      logoUrl: null,
      setLogoUrl: (url: string | null) => set({ logoUrl: url }),
      theme: "system",
      setTheme: (theme: Theme) => set({ theme }),
    }),
    {
      name: "receipt-settings",
    }
  )
);