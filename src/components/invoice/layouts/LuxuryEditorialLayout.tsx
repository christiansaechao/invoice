import { BillTo } from "../BillTo";
import { FromInfo } from "../FromInfo";

export function LuxuryEditorialLayout({ data }: { data: any }) {
    const { invoiceNumber, date, dueDate, billToOverride, rows, subtotal, total } = data;

    return (
        <div className="flex flex-col w-full h-full bg-[#FCFBF8] font-serif overflow-hidden relative pb-10">
            {/* Header Area */}
            <div className="px-10 pt-12 pb-6 flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <span className="text-4xl text-[#3A4E3E] font-medium leading-none">A</span>
                    <div className="flex flex-col tracking-widest text-[#3A4E3E] leading-tight">
                        <span className="font-semibold text-lg uppercase">Aura Beauty</span>
                        <span className="font-light text-sm uppercase">Collective</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] tracking-widest text-[#9FA89A] uppercase mb-1">Invoice No.</p>
                    <p className="text-lg text-[#3A4E3E] font-medium tracking-wider mb-4">#{invoiceNumber || "000"}</p>
                    <p className="text-[10px] tracking-widest text-[#9FA89A] uppercase mb-1">Date Issued</p>
                    <p className="text-sm text-[#3A4E3E]">{date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Date"}</p>
                </div>
            </div>

            {/* From Info */}
            <div className="px-10 pb-8">
                <FromInfo variant="luxury" />
            </div>

            {/* Client Strip */}
            <div className="w-full bg-[#F5F4EE] px-10 py-6 mb-8 flex justify-between items-center">
                <BillTo override={billToOverride} variant="luxury" />
                <div className="border-l-4 border-[#3A4E3E] bg-[#EAE8DD] px-4 py-3 text-sm text-[#3A4E3E]">
                    <span className="text-[#7A8275] italic pr-1">Payment Due:</span>
                    <span className="font-semibold">{dueDate ? new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Upon Receipt"}</span>
                </div>
            </div>

            {/* Table */}
            <div className="px-10 mb-auto">
                <div className="flex justify-between border-b border-[#EAE8DD] pb-2 mb-4">
                    <p className="text-[10px] tracking-widest text-[#9FA89A] uppercase">Description of Services</p>
                    <p className="text-[10px] tracking-widest text-[#9FA89A] uppercase">Amount (USD)</p>
                </div>
                {rows && rows.length > 0 ? rows.map((r: any, i: number) => (
                    <div key={i} className="flex justify-between mb-6">
                        <div className="flex flex-col max-w-[70%]">
                            <p className="text-[#3A4E3E] font-semibold text-sm">{r.item_name || "Item"}</p>
                            <p className="text-[#7A8275] text-xs italic mt-1">{r.description}</p>
                        </div>
                        <p className="text-[#3A4E3E] text-sm font-medium">
                            ${parseFloat(r.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                )) : (
                    <div className="flex justify-between mb-6">
                        <div className="flex flex-col">
                            <p className="text-[#3A4E3E] font-semibold text-sm">Services</p>
                        </div>
                        <p className="text-[#3A4E3E] text-sm font-medium">$0.00</p>
                    </div>
                )}
            </div>

            {/* Dark Green Totals Block */}
            <div className="bg-[#1A2D22] w-full px-10 py-8 text-[#F5F4EE] flex justify-between items-end mt-8">
                <div className="flex flex-col gap-2 max-w-[50%]">
                    <p className="font-medium italic">With Gratitude,</p>
                    <p className="text-xs text-[#8A988D]">Thank you for your business.</p>
                </div>
                <div className="flex flex-col gap-3 min-w-[200px]">
                    <div className="flex justify-between text-xs text-[#8A988D] uppercase tracking-wider">
                        <span>Subtotal</span>
                        <span>${subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#8A988D] uppercase tracking-wider pb-3 border-b border-[#3A4E3E]">
                        <span>Tax (0%)</span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                        <span className="text-[10px] tracking-widest uppercase text-[#8A988D]">Total Due</span>
                        <span className="text-xl font-bold">${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            {/* Bottom emblem */}
            <div className="w-full flex justify-center py-6 pb-2">
                <div className="h-10 w-10 rounded-full bg-[#EAE8DD] flex items-center justify-center text-[#5A6356] italic font-serif">A</div>
            </div>
        </div>
    );
}
