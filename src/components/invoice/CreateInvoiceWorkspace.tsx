import { useInvoiceWorkspace } from "@/store/invoice.store";
import { cn } from "@/utils/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

type WorkspaceProps = {
   date: string;
   setDate: (date: string) => void;
};

export function CreateInvoiceWorkspace({ date, setDate }: WorkspaceProps) {
    const { 
       workspaceMode, 
       setWorkspaceMode, 
       paymentTerms, 
       setPaymentTerms,
       schedulingConfig,
       setSchedulingConfig
    } = useInvoiceWorkspace();

    return (
        <div className="bg-card w-full border border-border shadow-sm rounded-xl p-6 flex flex-col gap-6 no-print">
           <div className="flex items-center justify-between">
             <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">Workspace</h2>
             <div className="flex bg-slate-100 p-1 rounded-lg w-[200px]">
                <button 
                   onClick={() => setWorkspaceMode('one-time')}
                   className={cn("flex-1 py-1.5 text-xs font-semibold rounded-md transition-all", workspaceMode === 'one-time' ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}
                >
                    One-Time
                </button>
                <button 
                   onClick={() => setWorkspaceMode('recurring')}
                   className={cn("flex-1 py-1.5 text-xs font-semibold rounded-md transition-all", workspaceMode === 'recurring' ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}
                >
                    Recurring
                </button>
             </div>
           </div>
           
           {workspaceMode === 'one-time' ? (
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                    <Label htmlFor="issue_date">Issue Date</Label>
                    <div className="relative">
                       <Input id="issue_date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <Label htmlFor="payment_terms">Payment Terms</Label>
                    <select 
                       id="payment_terms"
                       className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-offset-2 ring-offset-background"
                       value={paymentTerms}
                       onChange={(e: any) => setPaymentTerms(e.target.value)}
                    >
                       <option value="receipt">Due on Receipt</option>
                       <option value="net-15">Net 15</option>
                       <option value="net-30">Net 30</option>
                       <option value="net-60">Net 60</option>
                    </select>
                 </div>
              </div>
           ) : (
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-1">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                       <Label htmlFor="freq">Frequency</Label>
                       <select 
                          id="freq"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          value={schedulingConfig.frequency}
                          onChange={(e: any) => setSchedulingConfig({ frequency: e.target.value })}
                       >
                          <option value="weekly">Weekly</option>
                          <option value="bi-weekly">Bi-Weekly</option>
                          <option value="monthly">Monthly</option>
                       </select>
                    </div>
                    <div className="flex flex-col gap-2">
                       <Label htmlFor="issue_day">Issue Day</Label>
                       <select 
                          id="issue_day"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          value={schedulingConfig.issueDay}
                          onChange={(e: any) => setSchedulingConfig({ issueDay: e.target.value })}
                       >
                          {schedulingConfig.frequency !== "monthly" ? (
                             <>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                             </>
                          ) : (
                             <>
                                <option value="1st">1st of Month</option>
                                <option value="15th">15th of Month</option>
                                <option value="Last Day">Last Day of Month</option>
                             </>
                          )}
                       </select>
                    </div>
                 </div>

                 <div className="flex gap-4 items-center bg-secondary/10 border border-secondary/20 p-3 rounded-lg mt-2">
                     <div className="flex items-center gap-2">
                       <input 
                           type="checkbox" 
                           id="end_date"
                           checked={schedulingConfig.hasEndDate}
                           onChange={(e) => setSchedulingConfig({ hasEndDate: e.target.checked })}
                           className="h-4 w-4 rounded border-secondary text-primary focus:ring-primary transition-all"
                       />
                       <Label htmlFor="end_date" className="font-semibold text-foreground cursor-pointer select-none">Set an end date</Label>
                     </div>
                     
                     {schedulingConfig.hasEndDate && (
                         <div className="ml-auto flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                             <span className="text-sm font-medium text-muted-foreground">Stop after</span>
                             <Input 
                                type="number" 
                                min={1}
                                className="w-20 h-8" 
                                value={schedulingConfig.stopAfterXInvoices || ""}
                                onChange={(e) => setSchedulingConfig({ stopAfterXInvoices: parseInt(e.target.value) || null })}
                             />
                             <span className="text-sm font-medium text-muted-foreground">invoices</span>
                         </div>
                     )}
                 </div>
              </div>
           )}
        </div>
    );
}
