import { Button } from "@/components/ui/button";

export interface FeaturedClient {
  id: string;
  name: string;
  contactName: string;
  email: string;
  revenue: number;
  completedInvoices: number;
  notes: string[];
  is_archived: boolean;
}

export function FeaturedClientCard({ 
  client, 
  onEdit,
}: { 
  client: FeaturedClient; 
  onEdit?: () => void;
}) {
  const letters = client.name.substring(0, 2).toUpperCase();
  
  return (
    <div className={`relative bg-card rounded-3xl p-8 border-2 border-primary/20 shadow-xl overflow-hidden flex flex-col h-full lg:col-span-2 ${client.is_archived ? 'opacity-60 saturate-50' : ''}`}>
      {/* Decorative gradient blur in background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

      <div className="flex flex-col md:flex-row gap-8 items-start mb-8 z-10 w-full">
        {/* Logo block */}
        <div className="relative group">
          <div className="w-20 h-20 rounded-2xl bg-teal-500/10 flex items-center justify-center font-bold text-teal-500 text-2xl shadow-sm flex-shrink-0">
            {letters}
          </div>
          {onEdit && (
            <button 
              onClick={onEdit}
              className="absolute -top-2 -right-2 bg-primary text-primary-foreground p-1.5 rounded-lg shadow-lg hover:scale-110 transition-transform active:scale-95"
              title="Edit Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </button>
          )}
        </div>

        {/* Contact info blocks */}
          <div className="flex flex-col gap-2 items-end">
            <div className="flex flex-wrap gap-4 w-full justify-start md:justify-end">
              <div className="bg-muted/50 py-3 px-5 rounded-2xl border border-border flex items-center gap-3">
                <div className="p-1.5 bg-primary/10 rounded-full text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Key Contact</p>
                  <p className="text-sm font-semibold text-foreground">{client.contactName}</p>
                </div>
              </div>

              <div className="bg-muted/50 py-3 px-5 rounded-2xl border border-border flex items-center gap-3">
                <div className="p-1.5 bg-primary/10 rounded-full text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Email</p>
                  <p className="text-sm font-semibold text-foreground">{client.email}</p>
                </div>
              </div>
            </div>
          </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full z-10 flex-1">
        {/* Core details */}
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">{client.name}</h2>
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest bg-teal-500/20 text-teal-500 mb-8">
            HIGH VALUE
          </span>

          <div className="flex gap-10">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">Total Paid</p>
              <p className="text-3xl font-bold text-foreground">
                {client.revenue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">Completed Invoices</p>
              <p className="text-3xl font-bold text-foreground">{client.completedInvoices} <span className="text-lg text-muted-foreground font-medium">Billed</span></p>
            </div>
          </div>
        </div>

        {/* Preferences block */}
        <div className="flex-1 bg-muted/50 rounded-3xl p-6 border border-border flex flex-col justify-center">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-4">Client Notes</p>
          <ul className="space-y-3">
            {(client.notes || []).map((pref, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground/80 font-medium items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>{pref}</span>
              </li>
            ))}
            {(!client.notes || client.notes.length === 0) && (
              <li className="text-sm text-muted-foreground italic">No notes added yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
