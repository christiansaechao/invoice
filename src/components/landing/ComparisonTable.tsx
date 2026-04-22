import { Check, Minus } from "lucide-react";
import { COMPARISON_ROWS } from "@/constants/pricing";

function Cell({ value }: { value: string | boolean }) {
  if (value === true)  return <Check className="h-4 w-4 text-blue-500 mx-auto" />;
  if (value === false) return <Minus className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
  return <span>{value}</span>;
}

export function ComparisonTable() {
  return (
    <section className="px-6 md:px-12 max-w-4xl mx-auto pb-24 text-slate-900">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#6200EE]">
          Every detail <em>compared.</em>
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#F8FAFC] border-b border-slate-200">
            <tr>
              <th className="py-4 px-6 text-left font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Feature</th>
              <th className="py-4 px-6 text-center font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Starter</th>
              <th className="py-4 px-6 text-center font-semibold text-[#6200EE] uppercase tracking-wider text-[11px]">Pro</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.feature} className="hover:bg-[#F8FAFC]/50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">{row.feature}</td>
                <td className="py-4 px-6 text-center text-slate-500">
                  <Cell value={row.starter} />
                </td>
                <td className="py-4 px-6 text-center font-medium text-[#6200EE]">
                  <Cell value={row.pro} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
