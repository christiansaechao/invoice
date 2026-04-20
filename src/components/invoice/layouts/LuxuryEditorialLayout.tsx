import { BillTo } from "../BillTo";
import { FromInfo } from "../FromInfo";
import { PaymentSection } from "../PaymentSection";
import { TEMPLATE_THEMES } from "@/constants/template-themes";

export function LuxuryEditorialLayout({ data }: { data: any }) {
    const { invoiceNumber, date, dueDate, billToOverride, rows, subtotal, total, paymentLink, status, currency } = data;
    const t = TEMPLATE_THEMES.luxury;

    return (
        <div className="flex flex-col w-full h-full font-serif overflow-hidden relative pb-10" style={{ backgroundColor: t.bg.main }}>
            {/* Header Area */}
            <div className="px-10 pt-12 pb-6 flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <span className="text-4xl font-medium leading-none" style={{ color: t.primary }}>A</span>
                    <div className="flex flex-col tracking-widest leading-tight" style={{ color: t.primary }}>
                        <span className="font-semibold text-lg uppercase">Aura Beauty</span>
                        <span className="font-light text-sm uppercase">Collective</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: t.accent }}>Invoice No.</p>
                    <p className="text-lg font-medium tracking-wider mb-4" style={{ color: t.primary }}>#{invoiceNumber || "000"}</p>
                    <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: t.accent }}>Date Issued</p>
                    <p className="text-sm" style={{ color: t.primary }}>{date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Date"}</p>
                </div>
            </div>

            {/* From Info */}
            <div className="px-10 pb-8">
                <FromInfo variant="luxury" />
            </div>

            {/* Client Strip */}
            <div className="w-full px-10 py-6 mb-8 flex justify-between items-center" style={{ backgroundColor: t.bg.card }}>
                <BillTo override={billToOverride} variant="luxury" />
                <div className="border-l-4 px-4 py-3 text-sm flex gap-2" style={{ backgroundColor: t.border, borderColor: t.primary, color: t.primary }}>
                    <span className="italic pr-1" style={{ color: t.text.muted }}>Payment Due:</span>
                    <span className="font-semibold">{dueDate ? new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Upon Receipt"}</span>
                </div>
            </div>

            {/* Table */}
            <div className="px-10 mb-auto">
                <div className="flex justify-between border-b pb-2 mb-4" style={{ borderColor: t.border }}>
                    <p className="text-[10px] tracking-widest uppercase" style={{ color: t.accent }}>Description of Services</p>
                    <p className="text-[10px] tracking-widest uppercase" style={{ color: t.accent }}>Amount (USD)</p>
                </div>
                {rows && rows.length > 0 ? rows.map((r: any, i: number) => (
                    <div key={i} className="flex justify-between mb-6">
                        <div className="flex flex-col max-w-[70%]">
                            <p className="font-semibold text-sm" style={{ color: t.primary }}>{r.item_name || "Item"}</p>
                            <p className="text-xs italic mt-1" style={{ color: t.text.muted }}>{r.description}</p>
                        </div>
                        <p className="text-sm font-medium" style={{ color: t.primary }}>
                            ${parseFloat(r.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                )) : (
                    <div className="flex justify-between mb-6">
                        <div className="flex flex-col">
                            <p className="font-semibold text-sm" style={{ color: t.primary }}>Services</p>
                        </div>
                        <p className="text-sm font-medium" style={{ color: t.primary }}>$0.00</p>
                    </div>
                )}
            </div>

            {/* Dark Green Totals Block */}
            <div className="w-full px-10 py-8 flex justify-between items-end mt-8" style={{ backgroundColor: t.bg.footer, color: t.text.light }}>
                <div className="flex flex-col gap-2 max-w-[50%]">
                    <p className="font-medium italic">With Gratitude,</p>
                    <p className="text-xs opacity-60">Thank you for your business.</p>
                </div>
                <div className="flex flex-col gap-3 min-w-[200px]">
                    <div className="flex justify-between text-xs uppercase tracking-wider opacity-60">
                        <span>Subtotal</span>
                        <span>${subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xs uppercase tracking-wider pb-3 border-b opacity-60" style={{ borderColor: t.primary }}>
                        <span>Tax (0%)</span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                        <span className="text-[10px] tracking-widest uppercase opacity-60">Total Due</span>
                        <span className="text-xl font-bold">${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            {/* Bottom emblem */}
            <div className="w-full flex justify-center py-6 pb-2">
                <div className="h-10 w-10 rounded-full flex items-center justify-center italic font-serif" style={{ backgroundColor: t.border, color: t.secondary }}>A</div>
            </div>

            <div className="px-10">
                <PaymentSection 
                    paymentLink={paymentLink} 
                    status={status} 
                    total={total} 
                    currency={currency} 
                    templateSlug="luxury" 
                />
            </div>
        </div>
    );
}
