import React from "react";
import { TEMPLATE_THEMES } from "@/constants/template-themes";

interface PaymentSectionProps {
  paymentLink?: string | null;
  status?: string;
  total?: number;
  currency?: string;
  templateSlug?: string;
}

export function PaymentSection({ 
  paymentLink, 
  status = "draft", 
  total, 
  currency = "USD",
  templateSlug = "standard" 
}: PaymentSectionProps) {
  // Actionable check
  const isActionable = status === "sent" || status === "overdue";
  
  if (!paymentLink || !isActionable) return null;

  const t = TEMPLATE_THEMES[templateSlug] || TEMPLATE_THEMES.standard;
  const receiptsAppPurple = "#6200EE";

  return (
    <div className="mt-10 mb-6 p-8 border rounded-2xl flex flex-col items-center gap-4 text-center" style={{ backgroundColor: t.bg.header, borderColor: t.border }}>
      <p className="text-sm font-semibold" style={{ color: t.primary }}>
        Ready to pay {currency} ${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}?
      </p>
      
      <a 
        href={paymentLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="px-8 py-3 rounded-lg text-white font-bold transition-transform active:scale-95 shadow-lg shadow-purple-200"
        style={{ backgroundColor: receiptsAppPurple }}
      >
        Pay Invoice Now
      </a>

      <div className="flex flex-col gap-1 mt-2">
        <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: t.text.muted }}>
          Secure payment hosted by Receipts App
        </p>
        <p className="text-[10px] break-all max-w-[400px]" style={{ color: receiptsAppPurple }}>
          {paymentLink}
        </p>
      </div>
    </div>
  );
}
