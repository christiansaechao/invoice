import { Check, Minus } from "lucide-react";
import { COMPARISON_ROWS } from "@/constants/pricing";

function Cell({ value }: { value: string | boolean }) {
  if (value === true)  return <Check className="h-4 w-4 text-blue-500 mx-auto" />;
  if (value === false) return <Minus className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
  return <span>{value}</span>;
}

export function ComparisonTable() {
  return (
    <section className="px-6 md:px-12 max-w-4xl mx-auto pb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-medium text-primary">
          Every detail <em>compared.</em>
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-border">
            <tr>
              <th className="py-4 px-6 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Feature</th>
              <th className="py-4 px-6 text-center font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Starter</th>
              <th className="py-4 px-6 text-center font-semibold text-primary uppercase tracking-wider text-[11px]">Pro</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border/60">
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.feature} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-foreground">{row.feature}</td>
                <td className="py-4 px-6 text-center text-muted-foreground">
                  <Cell value={row.starter} />
                </td>
                <td className="py-4 px-6 text-center font-medium text-primary">
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
