import { BillTo } from "../BillTo";
import { FromInfo } from "../FromInfo";
import { TEMPLATE_THEMES } from "@/constants/template-themes";

export function ModernCorporateLayout({ data }: { data: any }) {
    const { invoiceNumber, date, dueDate, billToOverride, rows, total } = data;
    const t = TEMPLATE_THEMES.corporate;

    return (
        <div className="flex flex-col w-full h-full font-sans pb-10" style={{ backgroundColor: t.bg.main, color: t.text.main }}>
            {/* Navy brand header bar */}
            <div className="w-full px-10 py-7 flex justify-between items-center" style={{ backgroundColor: t.bg.header }}>
                <div className="flex flex-col gap-1">
                    <span className="text-white font-extrabold text-2xl tracking-tight leading-none">INVOICE</span>
                    <span className="text-xs font-semibold tracking-widest uppercase mt-1" style={{ color: t.accent }}>Corporate Document</span>
                </div>
                <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: t.accent }}>Invoice Number</p>
                    <p className="text-white text-xl font-bold tracking-wide">#{invoiceNumber || "001"}</p>
                </div>
            </div>

            {/* Blue accent stripe */}
            <div 
                className="h-1.5 w-full" 
                style={{ 
                    background: `linear-gradient(to right, ${t.secondary}, ${t.accent}, ${t.secondary})` 
                }} 
            />

            {/* Meta row */}
            <div className="px-10 py-6 border-b flex justify-between items-center" style={{ backgroundColor: t.bg.card, borderColor: t.border }}>
                <div className="flex gap-10">
                    <div>
                        <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: t.text.muted }}>Issue Date</p>
                        <p className="text-sm font-semibold" style={{ color: t.text.main }}>{date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}</p>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: t.text.muted }}>Due Date</p>
                        <p className="text-sm font-semibold" style={{ color: t.text.main }}>{dueDate ? new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Upon Receipt"}</p>
                    </div>
                </div>
                <div className="text-white px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide shadow" style={{ backgroundColor: t.primary }}>
                    CONFIDENTIAL
                </div>
            </div>

            {/* Billing info grid */}
            <div className="px-10 pt-8 pb-6 grid grid-cols-2 gap-8 border-b" style={{ borderColor: t.border }}>
                <FromInfo variant="corporate" />
                <BillTo override={billToOverride} variant="corporate" />
            </div>

            {/* Table */}
            <div className="px-10 pt-6 min-h-[240px]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="rounded-lg" style={{ backgroundColor: t.bg.card }}>
                            <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest rounded-l-lg" style={{ color: t.secondary }}>Description</th>
                            <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-right" style={{ color: t.secondary }}>Qty</th>
                            <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-right rounded-r-lg" style={{ color: t.secondary }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows && rows.length > 0 ? rows.map((r: any, i: number) => (
                            <tr key={i} className="border-b" style={{ borderColor: t.bg.card }}>
                                <td className="py-4 px-4 align-top">
                                    <p className="font-semibold text-sm" style={{ color: t.primary }}>{r.item_name || "Item"}</p>
                                    <p className="text-xs mt-0.5" style={{ color: t.text.muted }}>{r.description}</p>
                                </td>
                                <td className="py-4 px-4 text-sm text-right font-medium" style={{ color: t.text.muted }}>{r.quantity || 1}</td>
                                <td className="py-4 px-4 text-sm text-right font-bold" style={{ color: t.primary }}>
                                    ${parseFloat(r.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        )) : null}
                    </tbody>
                </table>
            </div>

            {/* Totals bar */}
            <div className="mx-10 mt-6 text-white rounded-xl px-6 py-5 flex justify-between items-center" style={{ backgroundColor: t.bg.header }}>
                <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: t.accent }}>Total Amount Due</div>
                <div className="text-2xl font-black tracking-tight">${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>

            <div className="px-10 mt-8 text-xs text-center" style={{ color: t.text.muted }}>
                Thank you for your business. Payment terms NET 30. For queries, contact accounts@yourcompany.com
            </div>
        </div>
    );
}
