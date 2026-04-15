import { BillTo } from "../BillTo";
import { FromInfo } from "../FromInfo";

export function BotanicalLayout({ data }: { data: any }) {
    const { invoiceNumber, date, dueDate, billToOverride, rows, subtotal, total } = data;

    return (
        <div className="flex flex-col w-full h-full bg-[#FCFDFB] font-serif text-[#1C2C23] pb-10">
            <div className="flex justify-between items-start pt-14 px-12 border-b border-green-900/10 pb-8">
                <div className="flex items-center gap-3">
                    <span className="text-5xl font-bold italic text-green-800">A</span>
                    <div className="flex flex-col leading-tight">
                        <span className="font-extrabold text-xl text-green-900 tracking-tight">Aura Beauty</span>
                        <span className="text-xs text-green-700/80 uppercase tracking-widest font-semibold mt-0.5">Botanical &amp; Organic</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-green-900/40 mb-1">Invoice Document</p>
                    <p className="text-xl font-bold tracking-wider text-green-900 mb-1">#{invoiceNumber || "000"}</p>
                    <p className="text-xs text-green-800/60 font-sans">{date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Date"}</p>
                </div>
            </div>

            <div className="px-12 flex justify-between pt-8 pb-10 border-b border-green-900/10">
                <FromInfo variant="botanical" />
                <BillTo override={billToOverride} variant="botanical" />
            </div>

            <div className="px-12 pt-8 min-h-[250px]">
                <div className="flex justify-between border-b border-green-900/20 pb-2 mb-6">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-green-800">Item Description</p>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-green-800">Amount</p>
                </div>
                {rows && rows.length > 0 ? rows.map((r: any, i: number) => (
                    <div key={i} className="flex justify-between mb-5">
                        <div className="flex flex-col max-w-[60%]">
                            <p className="font-bold text-sm text-green-900 mb-1">{r.item_name || "Item"}</p>
                            <p className="text-xs text-green-800/60 font-sans">{r.description}</p>
                        </div>
                        <p className="text-sm font-semibold text-green-900 mt-0.5">
                            ${parseFloat(r.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                )) : null}
            </div>

            <div className="px-12 flex justify-between items-end mt-8">
                <div className="w-[45%]">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-green-800 mb-2">Payment Notes</p>
                    <p className="text-[10px] text-green-800/60 font-sans leading-loose italic">
                        Please complete payment within 14 days. We accept bank transfers to the primary digital portal. Thank you for choosing Aura Beauty.
                    </p>
                </div>

                <div className="bg-[#2A3C24] text-[#F3F4EE] rounded-2xl p-6 w-[280px] shadow-xl">
                    <div className="flex justify-between items-center text-xs pb-3 border-b border-green-800/50 mb-3 font-sans opacity-80">
                        <span className="font-bold uppercase tracking-widest">Subtotal</span>
                        <span>${subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pb-4 border-b border-green-800/50 mb-4 font-sans opacity-80">
                        <span className="font-bold uppercase tracking-widest">Tax (0%)</span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#B5C4A1]">Total Due</span>
                        <span className="text-2xl font-bold">${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
