import { useSettings } from "@/store/settings.store";
import type { BillToInfo } from "@/store/settings.store";

export function BillTo({ override }: { override?: BillToInfo }) {
  const { billTo: defaultBillTo } = useSettings();
  const billTo = override || defaultBillTo;

  return (
    <div className="border border-border rounded-xl p-4 md:p-6 lg:p-[32px] bg-card shadow-sm">
      <div className="flex flex-col gap-2.5">
        <div className="text-xs tracking-widest uppercase text-muted-foreground font-sans mb-1">Bill To</div>

        <div className="border border-border bg-white rounded-2xl py-3.5 px-4 shadow-sm">
          <div className="py-1.5 leading-snug">
            <strong className="font-semibold">{billTo.manager}</strong>
          </div>
          <div className="text-muted-foreground text-[13px] leading-relaxed mt-1 pt-1 border-t border-slate-200/70">
            <div className="py-1">{billTo.companyName}</div>
            <div className="py-1 border-t border-slate-200/70">{billTo.addressLine1}</div>
            {billTo.addressLine2 && <div className="py-1 border-t border-slate-200/70">{billTo.addressLine2}</div>}
            {billTo.phoneNumber && <div className="py-1 border-t border-slate-200/70 text-muted-foreground tabular-nums">{billTo.phoneNumber}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
