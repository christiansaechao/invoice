import { BillTo } from "../BillTo";
import { FromInfo } from "../FromInfo";
import { PaymentSection } from "../PaymentSection";
import { TEMPLATE_THEMES } from "@/constants/template-themes";

export function BotanicalLayout({ data }: { data: any }) {
    const { invoiceNumber, date, billToOverride, rows, subtotal, total, paymentLink, status, currency, discount } = data;
    const t = TEMPLATE_THEMES.botanical;

    return (
        <div className="flex flex-col w-full h-full font-serif pb-10" style={{ backgroundColor: t.bg.main, color: t.text.main }}>
            <div className="flex justify-between items-start pt-14 px-12 border-b pb-8" style={{ borderColor: t.border }}>
                <div className="flex items-center gap-3">
                    <span className="text-5xl font-bold italic" style={{ color: t.secondary }}>A</span>
                    <div className="flex flex-col leading-tight">
                        <span className="font-extrabold text-xl tracking-tight" style={{ color: t.primary }}>Aura Beauty</span>
                        <span className="text-xs uppercase tracking-widest font-semibold mt-0.5 opacity-80" style={{ color: t.secondary }}>Botanical &amp; Organic</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-1 opacity-40" style={{ color: t.primary }}>Invoice Document</p>
                    <p className="text-xl font-bold tracking-wider mb-1" style={{ color: t.primary }}>#{invoiceNumber || "000"}</p>
                    <p className="text-xs font-sans opacity-60" style={{ color: t.secondary }}>{date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Date"}</p>
                </div>
            </div>

            <div className="px-12 flex justify-between pt-8 pb-10 border-b" style={{ borderColor: t.border }}>
                <FromInfo variant="botanical" />
                <BillTo override={billToOverride} variant="botanical" />
            </div>

            <div className="px-12 pt-8 min-h-[250px]">
                <div className="flex justify-between border-b pb-2 mb-6" style={{ borderColor: 'rgba(20, 83, 45, 0.2)' }}>
                    <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: t.secondary }}>Item Description</p>
                    <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: t.secondary }}>Amount</p>
                </div>
                {rows && rows.length > 0 ? rows.map((r: any, i: number) => (
                    <div key={i} className="flex justify-between mb-5">
                        <div className="flex flex-col max-w-[60%]">
                            <p className="font-bold text-sm mb-1" style={{ color: t.primary }}>{r.item_name || "Item"}</p>
                            <p className="text-xs font-sans opacity-60" style={{ color: t.secondary }}>{r.description}</p>
                        </div>
                        <p className="text-sm font-semibold mt-0.5" style={{ color: t.primary }}>
                            ${parseFloat(r.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                )) : null}
            </div>

            <div className="px-12 flex justify-between items-end mt-8">
                <div className="w-[45%]">
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-2" style={{ color: t.secondary }}>Payment Notes</p>
                    <p className="text-[10px] font-sans leading-loose italic opacity-60" style={{ color: t.secondary }}>
                        Please complete payment within 14 days. We accept bank transfers to the primary digital portal. Thank you for choosing Aura Beauty.
                    </p>
                </div>

                <div className="rounded-2xl p-6 w-[280px] shadow-xl" style={{ backgroundColor: t.bg.card, color: t.bg.footer }}>
                    <div className="flex justify-between items-center text-xs pb-3 border-b mb-3 font-sans opacity-80" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                        <span className="font-bold uppercase tracking-widest">Subtotal</span>
                        <span>${subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {discount && discount > 0 ? (
                        <div className="flex justify-between items-center text-xs pb-3 border-b mb-3 font-sans opacity-80" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                            <span className="font-bold uppercase tracking-widest">Discount</span>
                            <span>-${discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                    ) : null}
                    <div className="flex justify-between items-center text-xs pb-4 border-b mb-4 font-sans opacity-80" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                        <span className="font-bold uppercase tracking-widest">Tax (0%)</span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: t.text.light }}>Total Due</span>
                        <span className="text-2xl font-bold">${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            <div className="px-12">
                <PaymentSection 
                    paymentLink={paymentLink} 
                    status={status} 
                    total={total} 
                    currency={currency} 
                    templateSlug="botanical" 
                />
            </div>
        </div>
    );
}
