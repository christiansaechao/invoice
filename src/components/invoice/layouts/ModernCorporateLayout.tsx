import { BillTo } from "../BillTo";
import { FromInfo } from "../FromInfo";

export function ModernCorporateLayout({ data }: { data: any }) {
    const { invoiceNumber, date, dueDate, billToOverride, rows, subtotal, total } = data;

    return (
        <div className="flex flex-col w-full h-full bg-white font-sans text-slate-800 pb-10">
            {/* Navy brand header bar */}
            <div className="w-full bg-[#0F1F3D] px-10 py-7 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <span className="text-white font-extrabold text-2xl tracking-tight leading-none">INVOICE</span>
                    <span className="text-[#4A7BC4] text-xs font-semibold tracking-widest uppercase mt-1">Corporate Document</span>
                </div>
                <div className="text-right">
                    <p className="text-[#4A7BC4] text-[9px] uppercase tracking-widest font-bold mb-1">Invoice Number</p>
                    <p className="text-white text-xl font-bold tracking-wide">#{invoiceNumber || "001"}</p>
                </div>
            </div>

            {/* Blue accent stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1E4DA1] via-[#4A7BC4] to-[#1E4DA1]" />

            {/* Meta row */}
            <div className="px-10 py-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div className="flex gap-10">
                    <div>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1">Issue Date</p>
                        <p className="text-sm font-semibold text-slate-700">{date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}</p>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1">Due Date</p>
                        <p className="text-sm font-semibold text-slate-700">{dueDate ? new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Upon Receipt"}</p>
                    </div>
                </div>
                <div className="bg-[#0F1F3D] text-white px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide shadow">
                    CONFIDENTIAL
                </div>
            </div>

            {/* Billing info grid */}
            <div className="px-10 pt-8 pb-6 grid grid-cols-2 gap-8 border-b border-slate-100">
                <FromInfo variant="corporate" />
                <BillTo override={billToOverride} variant="corporate" />
            </div>

            {/* Table */}
            <div className="px-10 pt-6 min-h-[240px]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 rounded-lg">
                            <th className="py-3 px-4 text-[9px] font-bold text-[#1E4DA1] uppercase tracking-widest rounded-l-lg">Description</th>
                            <th className="py-3 px-4 text-[9px] font-bold text-[#1E4DA1] uppercase tracking-widest text-right">Qty</th>
                            <th className="py-3 px-4 text-[9px] font-bold text-[#1E4DA1] uppercase tracking-widest text-right rounded-r-lg">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows && rows.length > 0 ? rows.map((r: any, i: number) => (
                            <tr key={i} className="border-b border-slate-50">
                                <td className="py-4 px-4 align-top">
                                    <p className="font-semibold text-sm text-slate-900">{r.item_name || "Item"}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>
                                </td>
                                <td className="py-4 px-4 text-sm text-right text-slate-600 font-medium">{r.quantity || 1}</td>
                                <td className="py-4 px-4 text-sm text-right font-bold text-slate-900">
                                    ${parseFloat(r.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        )) : null}
                    </tbody>
                </table>
            </div>

            {/* Totals bar */}
            <div className="mx-10 mt-6 bg-[#0F1F3D] text-white rounded-xl px-6 py-5 flex justify-between items-center">
                <div className="text-[10px] text-[#4A7BC4] uppercase tracking-widest font-bold">Total Amount Due</div>
                <div className="text-2xl font-black tracking-tight">${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>

            <div className="px-10 mt-8 text-xs text-slate-400 text-center">
                Thank you for your business. Payment terms NET 30. For queries, contact accounts@yourcompany.com
            </div>
        </div>
    );
}
