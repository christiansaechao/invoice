import { BillTo } from "../BillTo";
import { FromInfo } from "../FromInfo";
import { PaymentSection } from "../PaymentSection";
import { TEMPLATE_THEMES } from "@/constants/template-themes";

export function CleanMinimalistSpaLayout({ data }: { data: any }) {
    const { invoiceNumber, date, billToOverride, rows, subtotal, total, paymentLink, status, currency, discount } = data;
    const t = TEMPLATE_THEMES.spa;

    return (
        <div className="flex flex-col w-full h-full font-sans pb-10" style={{ backgroundColor: t.bg.main }}>
            {/* Header top bar */}
            <div className="w-full flex items-center py-6 px-10 border-b" style={{ borderColor: t.border }}>
                <p className="text-xs tracking-widest font-medium uppercase" style={{ color: t.text.muted }}>Invoice Document</p>
            </div>

            <div className="px-10 pt-10 pb-8 flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center font-serif text-2xl italic shadow-md" style={{ backgroundColor: t.secondary, color: t.primary }}>
                        A
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-xl tracking-tight" style={{ color: t.text.main }}>Aura Beauty Collective</span>
                        <span className="text-[10px] tracking-widest uppercase" style={{ color: t.primary }}>Bespoke Bridal &amp; Styling</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] tracking-widest uppercase mb-1 font-semibold" style={{ color: t.text.muted }}>Invoice Number</p>
                    <p className="text-sm font-bold tracking-wider mb-3" style={{ color: t.primary }}>#{invoiceNumber || "000"}</p>
                    <p className="text-[9px] tracking-widest uppercase mb-1 font-semibold" style={{ color: t.text.muted }}>Issue Date</p>
                    <p className="text-xs font-medium" style={{ color: t.text.main }}>{date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Date"}</p>
                </div>
            </div>

            {/* Addresses section */}
            <div className="px-10 flex gap-8 mb-12">
                <FromInfo variant="spa" />
                <BillTo override={billToOverride} variant="spa" />
            </div>

            {/* Table */}
            <div className="px-10 mb-8">
                <div className="flex justify-between border-b pb-3 mb-5" style={{ borderColor: t.border }}>
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: t.primary }}>Service Description</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: t.primary }}>Amount</p>
                </div>
                {rows && rows.length > 0 ? rows.map((r: any, i: number) => (
                    <div key={i} className="flex justify-between mb-6 pb-6 border-b border-dotted" style={{ borderColor: t.bg.main }}>
                        <div className="flex flex-col max-w-[70%]">
                            <p className="font-semibold text-sm mb-1" style={{ color: t.text.main }}>{r.item_name || "Item"}</p>
                            <p className="text-xs" style={{ color: t.text.muted }}>{r.description}</p>
                        </div>
                        <p className="text-sm font-medium mt-1" style={{ color: t.text.main }}>
                            ${parseFloat(r.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                )) : null}
            </div>

            {/* Totals Section */}
            <div className="px-10 flex justify-end">
                <div className="w-[300px]">
                    <div className="flex justify-between text-xs mb-3" style={{ color: t.text.muted }}>
                        <span className="uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                        <span>${subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {discount && discount > 0 ? (
                        <div className="flex justify-between text-xs mb-3" style={{ color: t.text.muted }}>
                            <span className="uppercase tracking-widest text-[10px] font-bold">Discount</span>
                            <span>-${discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                    ) : null}
                    <div className="flex justify-between text-xs mb-4 pb-4 border-b" style={{ color: t.text.muted, borderColor: t.border }}>
                        <span className="uppercase tracking-widest text-[10px] font-bold">Tax <span className="bg-blue-50 text-blue-500 px-1 py-0.5 rounded text-[8px] ml-1">0%</span></span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-bold" style={{ color: t.text.main }}>Total Due</span>
                        <div className="text-right">
                            <span className="text-3xl font-black tracking-tight" style={{ color: t.secondary }}>${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            <p className="text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: t.primary }}>Thanks &amp; Joy</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="mt-16 px-10 text-center flex flex-col items-center gap-2 pb-6">
                <p className="text-xs font-bold" style={{ color: t.text.main }}>Thank you for your business</p>
                <p className="text-[9px] max-w-sm uppercase tracking-widest leading-relaxed" style={{ color: t.text.muted }}>
                    Please remit payment within 14 days of the issue date. All major credit cards, bank transfers, and digital wallets accepted.
                </p>
            </div>

            <div className="px-10">
                <PaymentSection 
                    paymentLink={paymentLink} 
                    status={status} 
                    total={total} 
                    currency={currency} 
                    templateSlug="spa" 
                />
            </div>
        </div>
    );
}
