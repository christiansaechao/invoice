import { BillTo } from "../BillTo";
import { FromInfo } from "../FromInfo";
import { TEMPLATE_THEMES } from "@/constants/template-themes";

export function ArtisanLayout({ data }: { data: any }) {
    const { invoiceNumber, date, dueDate, billToOverride, rows, total } = data;
    const t = TEMPLATE_THEMES.artisan;
    const g = t.gradient!;

    return (
        <div className="flex flex-col w-full h-full font-sans pb-10" style={{ backgroundColor: t.bg.main }}>
            {/* Top gradient bar */}
            <div 
                className="h-2 w-full" 
                style={{ 
                    background: `linear-gradient(to right, ${g.start}, ${g.via}, ${g.end})` 
                }} 
            />

            {/* Header */}
            <div className="px-10 pt-10 pb-8 flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <div 
                            className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-black text-lg italic shadow-md"
                            style={{ backgroundColor: t.primary, shadowColor: `${t.primary}33` }}
                        >
                            A
                        </div>
                        <div>
                            <p className="font-extrabold text-xl tracking-tight leading-none" style={{ color: t.text.main }}>The Artisan</p>
                            <p className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: t.accent }}>Creative Studio</p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="inline-block border rounded-xl px-4 py-3" style={{ backgroundColor: `${t.primary}0D`, borderColor: `${t.primary}33` }}>
                        <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: t.accent }}>Invoice</p>
                        <p className="text-lg font-black leading-none" style={{ color: t.primary }}>#{invoiceNumber || "001"}</p>
                    </div>
                </div>
            </div>

            {/* Dates row */}
            <div className="px-10 pb-8 flex gap-6">
                <div 
                    className="border rounded-xl px-5 py-3 flex flex-col gap-0.5"
                    style={{ background: `linear-gradient(to bottom right, ${t.bg.card}, ${t.border}4D)`, borderColor: t.border }}
                >
                    <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: t.accent }}>Issue Date</p>
                    <p className="text-xs font-semibold" style={{ color: t.text.main }}>{date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "—"}</p>
                </div>
                <div 
                    className="border rounded-xl px-5 py-3 flex flex-col gap-0.5"
                    style={{ background: `linear-gradient(to bottom right, ${t.bg.card}, ${t.border}4D)`, borderColor: t.border }}
                >
                    <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: t.accent }}>Due Date</p>
                    <p className="text-xs font-semibold" style={{ color: t.text.main }}>{dueDate ? new Date(dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Upon Receipt"}</p>
                </div>
            </div>

            {/* Bill To / From */}
            <div className="px-10 pb-8 grid grid-cols-2 gap-6">
                <FromInfo variant="artisan" />
                <BillTo override={billToOverride} variant="artisan" />
            </div>

            {/* Services */}
            <div className="px-10 min-h-[220px]">
                <div className="flex justify-between items-center border-b-2 pb-3 mb-4" style={{ borderColor: t.border }}>
                    <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: t.accent }}>Services Rendered</p>
                    <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: t.accent }}>Total</p>
                </div>
                {rows && rows.length > 0 ? rows.map((r: any, i: number) => (
                    <div key={i} className="flex justify-between mb-5 pb-5 border-b border-dashed last:border-0" style={{ borderColor: `${t.border}80` }}>
                        <div className="flex gap-3 max-w-[70%]">
                            <div 
                                className="mt-1 h-2 w-2 rounded-full flex-shrink-0" 
                                style={{ background: `linear-gradient(to bottom right, ${t.accent}, ${g.end})` }} 
                            />
                            <div>
                                <p className="font-bold text-sm" style={{ color: t.text.main }}>{r.item_name || "Service"}</p>
                                <p className="text-xs mt-0.5" style={{ color: t.text.muted }}>{r.description}</p>
                            </div>
                        </div>
                        <p className="font-bold text-sm" style={{ color: t.primary }}>
                            ${parseFloat(r.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                )) : null}
            </div>

            {/* Total block */}
            <div className="mx-10 mt-6 rounded-2xl overflow-hidden">
                <div 
                    className="px-6 py-5 flex justify-between items-center"
                    style={{ background: `linear-gradient(to right, ${t.primary}, ${g.end})` }}
                >
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: t.text.light }}>Total Due</p>
                        <p className="text-white text-2xl font-black tracking-tight mt-1">
                            ${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="text-right text-xs opacity-80 max-w-[180px]" style={{ color: t.text.light }}>
                        <p>Payment brings ideas to life.</p>
                        <p className="mt-1">Thank you for the opportunity ✦</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
