import { BillTo } from "../BillTo";
import { FromInfo } from "../FromInfo";

export function ModernStudioLayout({ data }: { data: any }) {
    const { invoiceNumber, date, dueDate, billToOverride, rows, subtotal, total } = data;

    return (
        <div className="flex flex-col w-full h-full bg-white font-sans text-slate-800 pb-10">
            {/* Top brand bar */}
            <div className="flex items-center px-10 py-5 bg-slate-50 border-b border-slate-100">
                <span className="font-semibold text-slate-600 tracking-tight italic">Studio Receipts</span>
            </div>

            <div className="relative px-10 pt-10 pb-6 border-b border-slate-100 flex items-start justify-between">
                <div className="absolute right-0 top-0 w-64 h-32 bg-cyan-50 opacity-40 rounded-bl-full pointer-events-none -z-10 overflow-hidden transform -translate-y-6 translate-x-4"></div>

                <div className="flex flex-col gap-5 z-10 w-full relative">
                    <div className="h-10 w-10 bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xl rounded-lg italic">S</div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">Invoice</h1>
                        <div className="flex gap-12">
                            <div>
                                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1">Number</p>
                                <p className="text-xs font-semibold text-slate-800">#{invoiceNumber || "000"}</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1">Date Issued</p>
                                <p className="text-xs font-semibold text-slate-800">{date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Date"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="z-10 shrink-0 text-right mt-2 flex flex-col items-end">
                    <div className="bg-cyan-50 px-6 py-4 rounded-2xl shadow-sm border border-cyan-100 text-right">
                        <p className="text-[9px] uppercase tracking-widest font-bold text-cyan-600 mb-1">Amount Due</p>
                        <p className="text-2xl font-black text-cyan-900 tracking-tight">${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
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
                        <tr className="border-b border-slate-100">
                            <th className="py-3 text-[9px] font-bold text-cyan-600 uppercase tracking-widest">Description</th>
                            <th className="py-3 text-[9px] font-bold text-cyan-600 uppercase tracking-widest text-center w-24">Qty</th>
                            <th className="py-3 text-[9px] font-bold text-cyan-600 uppercase tracking-widest text-right w-32">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows && rows.length > 0 ? rows.map((r: any, i: number) => (
                            <tr key={i} className="border-b border-slate-50 last:border-b-0">
                                <td className="py-4 align-top">
                                    <p className="font-semibold text-sm text-slate-800">{r.item_name || "Item"}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>
                                </td>
                                <td className="py-4 align-top text-center text-sm font-medium text-slate-600">{r.quantity || 1}</td>
                                <td className="py-4 align-top text-right text-sm font-medium text-slate-800">
                                    ${parseFloat(r.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        )) : null}
                    </tbody>
                </table>
            </div>

            <div className="px-10 grid grid-cols-2 gap-8 items-start mt-6">
                <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100 mt-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-orange-600 mb-2">Payment Notes</p>
                    <p className="text-[10px] text-orange-800/80 leading-relaxed">
                        Please deposit the due amount to the bank account referenced securely on your initial contract. Thank you!
                    </p>
                </div>

                <div className="flex flex-col gap-3 my-auto ml-auto min-w-[250px]">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 text-xs">
                        <span className="text-slate-500 font-semibold">Subtotal</span>
                        <span className="text-slate-800 font-bold">${subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 text-xs">
                        <span className="text-slate-500 font-semibold">Tax (0%)</span>
                        <span className="text-slate-800 font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                        <span className="text-[10px] text-cyan-600 uppercase tracking-widest font-bold">Total Due</span>
                        <span className="text-2xl font-black text-slate-900">${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
