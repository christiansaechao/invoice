export const CollaborationCards = () => {

    return (
        <div className="relative rounded-2xl border border-border p-4 flex flex-col gap-3">
            {/* Sponsored badge */}
            <span
                className="absolute top-3 right-3 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                style={{ background: "#f0e6ff", color: "#6200EE" }}
            >
                Sponsored
            </span>

            {/* Brand avatar */}
            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center text-background text-xs font-bold">
                Z
            </div>

            {/* Brand name */}
            <div>
                <p className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground">Brand</p>
                <p className="font-bold text-foreground">Zenith Watch Co.</p>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">
                        Post Date
                    </p>
                    <p className="font-semibold text-foreground">Oct 24, 2024</p>
                </div>
                <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">
                        Est. Payout
                    </p>
                    <p className="font-bold text-primary">$8,500.00</p>
                </div>
            </div>

            <button className="w-full border border-border rounded-xl py-2 text-xs font-semibold text-foreground hover:bg-muted/30 transition-colors">
                View Brief
            </button>
        </div>
    )
}