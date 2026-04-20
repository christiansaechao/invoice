import { BillTo } from "../BillTo";
import { FromInfo } from "../FromInfo";
import { PaymentSection } from "../PaymentSection";
import { TEMPLATE_THEMES } from "@/constants/template-themes";

export function ModernStudioLayout({ data }: { data: any }) {
    const { invoiceNumber, date, billToOverride, rows, subtotal, total, paymentLink, status, currency } = data;
    const t = TEMPLATE_THEMES.studio;

    return (
        <div className="flex flex-col w-full h-full font-sans pb-10" style={{ backgroundColor: t.bg.main, color: t.text.main }}>
            {/* Top brand bar */}
            <div className="flex items-center px-10 py-5 border-b" style={{ backgroundColor: t.bg.header, borderColor: t.border }}>
                <span className="font-semibold tracking-tight italic" style={{ color: t.text.muted }}>Studio Receipts</span>
            </div>

            <div className="relative px-10 pt-10 pb-6 border-b flex items-start justify-between" style={{ borderColor: t.border }}>
                <div 
                    className="absolute right-0 top-0 w-64 h-32 opacity-40 rounded-bl-full pointer-events-none -z-10 overflow-hidden transform -translate-y-6 translate-x-4"
                    style={{ backgroundColor: t.bg.card }}
                ></div>

                <div className="flex flex-col gap-5 z-10 w-full relative">
                    <div 
                        className="h-10 w-10 flex items-center justify-center font-bold text-xl rounded-lg italic"
                        style={{ backgroundColor: t.bg.card, color: t.secondary }}
                    >
                        S
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-4" style={{ color: t.primary }}>Invoice</h1>
                        <div className="flex gap-12">
                            <div>
                                <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: t.text.muted }}>Number</p>
                                <p className="text-xs font-semibold" style={{ color: t.primary }}>#{invoiceNumber || "000"}</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: t.text.muted }}>Date Issued</p>
                                <p className="text-xs font-semibold" style={{ color: t.primary }}>{date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Date"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="z-10 shrink-0 text-right mt-2 flex flex-col items-end">
                    <div className="px-6 py-4 rounded-2xl shadow-sm border text-right" style={{ backgroundColor: t.bg.card, borderColor: t.border }}>
                        <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: t.accent }}>Amount Due</p>
                        <p className="text-2xl font-black tracking-tight" style={{ color: t.primary }}>${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>

            <div className="px-10 py-8 grid grid-cols-2 gap-8">
                <FromInfo variant="studio" />
                <BillTo override={billToOverride} variant="studio" />
            </div>

            <div className="px-10 min-h-[300px]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b" style={{ borderColor: t.border }}>
                            <th className="py-3 text-[9px] font-bold uppercase tracking-widest" style={{ color: t.accent }}>Description</th>
                            <th className="py-3 text-[9px] font-bold uppercase tracking-widest text-center w-24" style={{ color: t.accent }}>Qty</th>
                            <th className="py-3 text-[9px] font-bold uppercase tracking-widest text-right w-32" style={{ color: t.accent }}>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows && rows.length > 0 ? rows.map((r: any, i: number) => (
                            <tr key={i} className="border-b last:border-b-0" style={{ borderColor: t.bg.header }}>
                                <td className="py-4 align-top">
                                    <p className="font-semibold text-sm" style={{ color: t.primary }}>{r.item_name || "Item"}</p>
                                    <p className="text-xs mt-0.5" style={{ color: t.text.muted }}>{r.description}</p>
                                </td>
                                <td className="py-4 align-top text-center text-sm font-medium" style={{ color: t.text.muted }}>{r.quantity || 1}</td>
                                <td className="py-4 align-top text-right text-sm font-medium" style={{ color: t.primary }}>
                                    ${parseFloat(r.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        )) : null}
                    </tbody>
                </table>
            </div>

            <div className="px-10 grid grid-cols-2 gap-8 items-start mt-6">
                <div className="p-6 rounded-xl border mt-2" style={{ backgroundColor: 'rgba(255, 237, 213, 0.5)', borderColor: '#FED7AA' }}>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#EA580C' }}>Payment Notes</p>
                    <p className="text-[10px] leading-relaxed" style={{ color: '#9A3412' }}>
                        Please deposit the due amount to the bank account referenced securely on your initial contract. Thank you!
                    </p>
                </div>

                <div className="flex flex-col gap-3 my-auto ml-auto min-w-[250px]">
                    <div className="flex justify-between items-center pb-2 border-b text-xs" style={{ borderColor: t.border }}>
                        <span className="font-semibold" style={{ color: t.text.muted }}>Subtotal</span>
                        <span className="font-bold" style={{ color: t.primary }}>${subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 text-xs">
                        <span className="font-semibold" style={{ color: t.text.muted }}>Tax (0%)</span>
                        <span className="font-bold" style={{ color: t.primary }}>$0.00</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: t.accent }}>Total Due</span>
                        <span className="text-2xl font-black" style={{ color: t.primary }}>${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            <div className="px-10">
                <PaymentSection 
                    paymentLink={paymentLink} 
                    status={status} 
                    total={total} 
                    currency={currency} 
                    templateSlug="studio" 
                />
            </div>
        </div>
    );
}
