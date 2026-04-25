import { useSettings } from "@/store/settings.store";

type TotalsProps = {
  hourlyRate: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid?: number;
  balanceDue?: number;
  currency?: string;
};

// Helper for currency formatting
const money = (n: number, currency: string = "USD") => {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: currency,
  });
};

export function Totals({
  hourlyRate,
  subtotal,
  discount,
  tax,
  total,
  paid,
  balanceDue,
  currency = "USD",
}: TotalsProps) {
  const { defaultTemplateId } = useSettings();
  const rateAsNumber = parseFloat(hourlyRate) || 0;

  const isMinimal = defaultTemplateId === "minimal";

  if (isMinimal) {
    return (
      <div className="flex flex-col items-end w-full mt-6">
        <div className="w-72">
          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-slate-500 text-sm font-medium">Hourly Rate</span>
            <span className="text-slate-900 font-medium tabular-nums">{money(rateAsNumber, currency)} / hr</span>
          </div>
          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-slate-500 text-sm font-medium">Subtotal</span>
            <span className="text-slate-900 font-medium tabular-nums">{money(subtotal, currency)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between py-3 border-b border-slate-100">
              <span className="text-slate-500 text-sm font-medium">Discount</span>
              <span className="text-slate-900 font-medium tabular-nums">-{money(discount, currency)}</span>
            </div>
          )}
          {tax > 0 && (
            <div className="flex justify-between py-3 border-b border-slate-100">
              <span className="text-slate-500 text-sm font-medium">Tax</span>
              <span className="text-slate-900 font-medium tabular-nums">{money(tax, currency)}</span>
            </div>
          )}
          {paid !== undefined && paid > 0 && (
            <div className="flex justify-between py-3 border-b border-slate-100">
              <span className="text-slate-500 text-sm font-medium">Paid</span>
              <span className="text-slate-900 font-medium tabular-nums">{money(paid, currency)}</span>
            </div>
          )}
          <div className="flex justify-between py-4 border-b-2 border-slate-800 items-end mt-2">
            <span className="text-slate-900 font-bold uppercase tracking-wider">
              {balanceDue !== undefined ? "Balance Due" : "Total"}
            </span>
            <span className="text-slate-900 font-extrabold text-2xl tabular-nums">
              {money(balanceDue !== undefined ? balanceDue : total, currency)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 mt-6 items-start w-full">
      <div className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-xs tracking-widest uppercase text-slate-500 font-sans font-semibold">Summary</h3>

        <div className="grid grid-cols-[1fr_140px] gap-3 items-center my-2.5">
          <label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Hourly Rate</label>
          <div id="hourlyRate" className="border border-slate-200 rounded-lg py-2 px-3 bg-white text-right font-medium text-sm tabular-nums text-slate-900">
            {money(rateAsNumber, currency)}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_140px] gap-3 items-center my-2.5">
          <label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Subtotal</label>
          <div id="subtotal" className="border border-slate-200 rounded-lg py-2 px-3 bg-white text-right font-medium text-sm tabular-nums text-slate-900">
            {money(subtotal, currency)}
          </div>
        </div>

        {discount > 0 && (
          <div className="grid grid-cols-[1fr_140px] gap-3 items-center my-2.5">
            <label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Discount</label>
            <div className="border border-slate-200 rounded-lg py-2 px-3 bg-white text-right font-medium text-sm tabular-nums text-red-600">
              -{money(discount, currency)}
            </div>
          </div>
        )}

        {tax > 0 && (
          <div className="grid grid-cols-[1fr_140px] gap-3 items-center my-2.5">
            <label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Tax</label>
            <div className="border border-slate-200 rounded-lg py-2 px-3 bg-white text-right font-medium text-sm tabular-nums text-slate-900">
              {money(tax, currency)}
            </div>
          </div>
        )}

        {paid !== undefined && paid > 0 && (
          <div className="grid grid-cols-[1fr_140px] gap-3 items-center my-2.5">
            <label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Paid</label>
            <div className="border border-slate-200 rounded-lg py-2 px-3 bg-white text-right font-medium text-sm tabular-nums text-green-600">
              {money(paid, currency)}
            </div>
          </div>
        )}

        <div className="grid grid-cols-[1fr_140px] gap-3 items-center mt-4 pt-4 border-t border-dashed border-slate-200 border-b-0">
          <label>
            <strong className="text-sm uppercase tracking-wider text-slate-900">
              {balanceDue !== undefined ? "Balance Due" : "Total"}
            </strong>
          </label>
          <div id="total" className="border-2 border-primary/20 rounded-lg py-2.5 px-3 bg-primary/5 text-right font-bold text-lg text-primary tabular-nums">
            {money(balanceDue !== undefined ? balanceDue : total, currency)}
          </div>
        </div>
      </div>
    </div>
  );
}
