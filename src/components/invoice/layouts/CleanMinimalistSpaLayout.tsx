import { BillTo } from "../BillTo";
import { FromInfo } from "../FromInfo";

export function CleanMinimalistSpaLayout({ data }: { data: any }) {
    const { invoiceNumber, date, dueDate, billToOverride, rows, subtotal, total } = data;

    return (
        <div className="flex flex-col w-full h-full bg-[#FAFAFA] font-sans pb-10">
            {/* Header top bar */}
            <div className="w-full flex items-center py-6 px-10 border-b border-gray-100">
                <p className="text-xs tracking-widest text-slate-400 font-medium uppercase">Invoice Document</p>
            </div>

            <div className="px-10 pt-10 pb-8 flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#2A3B31] flex items-center justify-center text-[#E0B876] font-serif text-2xl italic shadow-md">
                        A
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-xl tracking-tight">Aura Beauty Collective</span>
                        <span className="text-[10px] tracking-widest text-[#E0B876] uppercase">Bespoke Bridal &amp; Styling</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] tracking-widest text-slate-400 uppercase mb-1 font-semibold">Invoice Number</p>
                    <p className="text-sm font-bold text-slate-700 tracking-wider mb-3">#{invoiceNumber || "000"}</p>
                    <p className="text-[9px] tracking-widest text-slate-400 uppercase mb-1 font-semibold">Issue Date</p>
                    <p className="text-xs text-slate-600 font-medium">{date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Date"}</p>
                </div>
            </div>

            {/* Addresses section */}
            <div className="px-10 flex gap-8 mb-12">
                <FromInfo variant="spa" />
                <BillTo override={billToOverride} variant="spa" />
            </div>

            {/* Table */}
            <div className="px-10 mb-8">
                <div className="flex justify-between border-b border-gray-200 pb-3 mb-5">
                    <p className="text-[9px] font-bold text-[#E0B876] uppercase tracking-widest">Service Description</p>
                    <p className="text-[9px] font-bold text-[#E0B876] uppercase tracking-widest">Amount</p>
                </div>
                {rows && rows.length > 0 ? rows.map((r: any, i: number) => (
                    <div key={i} className="flex justify-between mb-6 pb-6 border-b border-gray-50 border-dotted">
                        <div className="flex flex-col max-w-[70%]">
                            <p className="text-slate-800 font-semibold text-sm mb-1">{r.item_name || "Item"}</p>
                            <p className="text-slate-400 text-xs">{r.description}</p>
                        </div>
                        <p className="text-slate-600 text-sm font-medium mt-1">
                            ${parseFloat(r.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                )) : null}
            </div>

            {/* Totals Section */}
            <div className="px-10 flex justify-end">
                <div className="w-[300px]">
                    <div className="flex justify-between text-xs text-slate-500 mb-3">
                        <span className="uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                        <span>${subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mb-4 pb-4 border-b border-gray-200">
                        <span className="uppercase tracking-widest text-[10px] font-bold">Tax <span className="bg-blue-50 text-blue-500 px-1 py-0.5 rounded text-[8px] ml-1">0%</span></span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-bold text-slate-800">Total Due</span>
                        <div className="text-right">
                            <span className="text-3xl font-black tracking-tight text-[#2A3B31]">${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            <p className="text-[9px] text-[#E0B876] font-bold uppercase tracking-widest mt-1">Thanks &amp; Joy</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="mt-16 px-10 text-center flex flex-col items-center gap-2 pb-6">
                <p className="text-xs font-bold text-slate-800">Thank you for your business</p>
                <p className="text-[9px] text-slate-400 max-w-sm uppercase tracking-widest leading-relaxed">
                    Please remit payment within 14 days of the issue date. All major credit cards, bank transfers, and digital wallets accepted.
                </p>
            </div>
        </div>
    );
}
