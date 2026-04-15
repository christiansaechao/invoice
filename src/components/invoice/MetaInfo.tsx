import { useSettings } from "@/store/settings.store";
import { useInvoiceWorkspace } from "@/store/invoice.store";

type MetaInfoProps = {
  invoiceNumber: string;
  date: string;
  dueDate: string;
};

export function MetaInfo({
  invoiceNumber,
  date,
  dueDate,
}: MetaInfoProps) {
  const { defaultTemplateId } = useSettings();
  const { workspaceMode, schedulingConfig, paymentTerms } = useInvoiceWorkspace();

  const isMinimal = defaultTemplateId === "minimal";
  
  const paymentTermStr = paymentTerms === "receipt" ? "Due on Receipt" : paymentTerms.replace("net-", "Net ");
  
  const recurringStr = `Billed ${schedulingConfig.frequency} on ${schedulingConfig.issueDay} with ${paymentTermStr} terms${schedulingConfig.hasEndDate && schedulingConfig.stopAfterXInvoices ? ` (Next ${schedulingConfig.stopAfterXInvoices} invoices)` : ""}`;

  if (isMinimal) {
    return (
        <div className="text-right min-w-[200px]">
          <h2 className="text-4xl font-serif text-primary mb-6 uppercase">Invoice</h2>
          
          <div className="flex justify-end gap-6 text-sm mb-1.5">
            <span className="text-slate-400 font-medium tracking-wide uppercase text-[10px]">Invoice No.</span>
            <span className="font-serif font-bold text-primary w-24 text-right">
              #{invoiceNumber ? invoiceNumber : "___"}
            </span>
          </div>
          
          {workspaceMode === "one-time" ? (
             <>
                <div className="flex justify-end gap-6 text-sm mb-1.5">
                  <span className="text-slate-400 font-medium tracking-wide uppercase text-[10px]">Date</span>
                  <span className="font-medium text-slate-900 w-24 text-right">
                    {date ? date : "___"}
                  </span>
                </div>
                
                <div className="flex justify-end gap-6 text-sm">
                  <span className="text-slate-400 font-medium tracking-wide uppercase text-[10px]">Due Date</span>
                  <span className="font-medium text-slate-900 w-24 text-right">
                    {dueDate ? dueDate : "___"}
                  </span>
                </div>
             </>
          ) : (
             <div className="flex justify-end max-w-[250px] ml-auto text-sm mt-3 border-t border-slate-100 pt-3">
                <span className="font-medium text-slate-600 text-right leading-snug">
                   {recurringStr}
                </span>
             </div>
          )}
        </div>
    );
  }

  return (
      <div className="text-right min-w-[280px]">
        <div className="inline-block py-1.5 px-3 bg-primary text-primary-foreground font-serif rounded-full text-xs mb-3 font-semibold tracking-wider shadow-sm">
          INVOICE
        </div>
        <div className="flex justify-end items-center gap-3 my-1.5 text-sm">
          <label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Invoice #</label>
          <div className="font-serif font-bold text-primary text-lg">{invoiceNumber}</div>
        </div>
        
        {workspaceMode === "one-time" ? (
           <>
              <div className="flex justify-end items-center gap-3 my-1.5 text-sm">
                <label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Invoice Date</label>
                <div className="font-medium capitalize">{date}</div>
              </div>
              <div className="flex justify-end items-center gap-3 my-1.5 text-sm">
                <label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Due Date</label>
                <div className="font-medium capitalize">{dueDate}</div>
              </div>
           </>
        ) : (
           <div className="flex justify-end items-start gap-3 mt-3 text-sm border-t border-border/40 pt-3 max-w-[280px] ml-auto">
              <span className="font-medium text-slate-700 bg-secondary/50 py-1.5 px-3 rounded-lg text-right shadow-sm border border-secondary">
                 {recurringStr}
              </span>
           </div>
        )}
      </div>
  );
}
