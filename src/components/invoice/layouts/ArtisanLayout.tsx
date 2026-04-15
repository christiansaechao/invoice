import { BillTo } from "../BillTo";
import { FromInfo } from "../FromInfo";

export function ArtisanLayout({ data }: { data: any }) {
    const { invoiceNumber, date, dueDate, billToOverride, rows, subtotal, total } = data;

    return (
        <div className="flex flex-col w-full h-full bg-white font-sans pb-10">
            {/* Top gradient bar */}
            <div className="h-2 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500" />

            {/* Header */}
            <div className="px-10 pt-10 pb-8 flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black text-lg italic shadow-md shadow-violet-200">
                            A
                        </div>
                        <div>
                            <p className="font-extrabold text-slate-900 text-xl tracking-tight leading-none">The Artisan</p>
                            <p className="text-[10px] text-violet-500 font-semibold uppercase tracking-widest mt-0.5">Creative Studio</p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="inline-block bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
                        <p className="text-[9px] uppercase tracking-widest font-bold text-violet-400 mb-1">Invoice</p>
                        <p className="text-lg font-black text-violet-700 leading-none">#{invoiceNumber || "001"}</p>
                    </div>
                </div>
            </div>

            {/* Dates row */}
            <div className="px-10 pb-8 flex gap-6">
                <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-100 rounded-xl px-5 py-3 flex flex-col gap-0.5">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-violet-400">Issue Date</p>
                    <p className="text-xs font-semibold text-slate-700">{date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "—"}</p>
                </div>
                <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-100 rounded-xl px-5 py-3 flex flex-col gap-0.5">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-violet-400">Due Date</p>
                    <p className="text-xs font-semibold text-slate-700">{dueDate ? new Date(dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Upon Receipt"}</p>
                </div>
            </div>

            {/* Bill To / From */}
            <div className="px-10 pb-8 grid grid-cols-2 gap-6">
                <FromInfo variant="artisan" />
                <BillTo override={billToOverride} variant="artisan" />
            </div>

            {/* Services */}
            <div className="px-10 min-h-[220px]">
                <div className="flex justify-between items-center border-b-2 border-violet-100 pb-3 mb-4">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-violet-500">Services Rendered</p>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-violet-500">Total</p>
                </div>
                {rows && rows.length > 0 ? rows.map((r: any, i: number) => (
                    <div key={i} className="flex justify-between mb-5 pb-5 border-b border-dashed border-violet-50 last:border-0">
                        <div className="flex gap-3 max-w-[70%]">
                            <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-sm text-slate-800">{r.item_name || "Service"}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>
                            </div>
                        </div>
                        <p className="font-bold text-sm text-violet-700">
                            ${parseFloat(r.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                )) : null}
            </div>

            {/* Total block */}
            <div className="mx-10 mt-6 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-5 flex justify-between items-center">
                    <div>
                        <p className="text-violet-200 text-[10px] uppercase tracking-widest font-bold">Total Due</p>
                        <p className="text-white text-2xl font-black tracking-tight mt-1">
                            ${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="text-right text-violet-200 text-xs opacity-80 max-w-[180px]">
                        <p>Payment brings ideas to life.</p>
                        <p className="mt-1">Thank you for the opportunity ✦</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
