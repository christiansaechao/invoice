import { create } from "zustand";

export type WorkspaceMode = "one-time" | "recurring";

export type SchedulingConfig = {
    frequency: "weekly" | "bi-weekly" | "monthly";
    issueDay: string; // e.g., "Monday", "1st"
    hasEndDate: boolean;
    stopAfterXInvoices: number | null;
};

export type PaymentTerms = "receipt" | "net-15" | "net-30" | "net-60";

type InvoiceStoreState = {
    workspaceMode: WorkspaceMode;
    setWorkspaceMode: (mode: WorkspaceMode) => void;
    
    // One-Time Form Data
    paymentTerms: PaymentTerms;
    setPaymentTerms: (terms: PaymentTerms) => void;
    
    // Recurring Form Data
    schedulingConfig: SchedulingConfig;
    setSchedulingConfig: (config: Partial<SchedulingConfig>) => void;
    
    // Discount Form Data
    discountMode: "flat" | "percent";
    setDiscountMode: (mode: "flat" | "percent") => void;
    discountValue: number;
    setDiscountValue: (val: number) => void;
};

export const useInvoiceWorkspace = create<InvoiceStoreState>((set) => ({
    workspaceMode: "one-time",
    setWorkspaceMode: (mode) => set({ workspaceMode: mode }),
    
    paymentTerms: "receipt",
    setPaymentTerms: (terms) => set({ paymentTerms: terms }),

    schedulingConfig: {
        frequency: "monthly",
        issueDay: "1st",
        hasEndDate: false,
        stopAfterXInvoices: null
    },
    setSchedulingConfig: (config) => set((state) => ({ 
        schedulingConfig: { ...state.schedulingConfig, ...config } 
    })),
    
    discountMode: "flat",
    setDiscountMode: (mode) => set({ discountMode: mode }),
    discountValue: 0,
    setDiscountValue: (val) => set({ discountValue: val })
}));
