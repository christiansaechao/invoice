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
    
    documentType: "invoice" | "quote";
    setDocumentType: (type: "invoice" | "quote") => void;
    
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

    // Tax Form Data
    /** Tax rate in basis points — e.g. 825 = 8.25% */
    taxRateBps: number;
    setTaxRateBps: (val: number) => void;

    // Nudge Config
    nudgeConfig: {
        enabled: boolean;
        profile: 'chill' | 'professional' | 'direct';
        workWeekOnly: boolean;
    };
    setNudgeConfig: (config: Partial<InvoiceStoreState['nudgeConfig']>) => void;
};

export const useInvoiceWorkspace = create<InvoiceStoreState>((set) => ({
    workspaceMode: "one-time",
    setWorkspaceMode: (mode) => set({ workspaceMode: mode }),
    
    documentType: "invoice",
    setDocumentType: (type) => set({ documentType: type }),
    
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
    setDiscountValue: (val) => set({ discountValue: val }),

    taxRateBps: 0,
    setTaxRateBps: (val) => set({ taxRateBps: val }),

    nudgeConfig: {
        enabled: false,
        profile: 'chill',
        workWeekOnly: true
    },
    setNudgeConfig: (config) => set((state) => ({
        nudgeConfig: { ...state.nudgeConfig, ...config }
    }))
}));
