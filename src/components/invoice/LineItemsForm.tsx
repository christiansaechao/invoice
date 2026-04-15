import { useState } from "react";
import type { Row } from "@/types/entries.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Calculator } from "lucide-react";
import { useInvoiceWorkspace } from "@/store/invoice.store";
import { cn } from "@/utils/utils";

type LineItemsFormProps = {
  rows: Row[];
  hourlyRate: string;
  setHourlyRate: (rate: string) => void;
  updateRow: (index: number, field: keyof Row, value: string) => void;
  removeRow: (index: number) => void;
  addRow: () => void;
  autoCalc: () => void;
  hideAutoCalc?: boolean;
};

export function LineItemsForm({
  rows,
  hourlyRate,
  setHourlyRate,
  updateRow,
  removeRow,
  addRow,
  autoCalc,
  hideAutoCalc
}: LineItemsFormProps) {
  const { discountMode, setDiscountMode, discountValue, setDiscountValue } = useInvoiceWorkspace();
  const [showDiscount, setShowDiscount] = useState(discountValue > 0);

  return (
    <div className="border-t border-border pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold tracking-tight">Line Items</h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="hourlyRate" className="whitespace-nowrap">Rate ($)</Label>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            step="0.01"
            className="w-24 text-right"
            placeholder="0.00"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>
      </div>

      <datalist id="historical-items">
        <option value="Consulting" />
        <option value="Hardware" />
        <option value="Software License" />
        <option value="Maintenance" />
        <option value="Labor" />
        <option value="Materials" />
        <option value="Lawn Mowing" />
        <option value="Cleaning" />
      </datalist>

      <div className="flex flex-col gap-4">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-col gap-3 p-4 border border-border rounded-lg bg-background/50 relative group">
            {rows.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-3 -right-3 h-[28px] w-[28px] rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity"
                onClick={() => removeRow(i)}
                title="Remove item"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="flex flex-col gap-2 w-full sm:col-span-5">
                <Label className="text-xs">Date</Label>
                <Input
                  type="date"
                  value={row.service_date}
                  onChange={(e) => updateRow(i, "service_date", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 w-full sm:col-span-7">
                <Label className="text-xs">Item Name</Label>
                <Input
                  type="text"
                  list="historical-items"
                  placeholder="Task Name"
                  value={row.item_name}
                  onChange={(e) => updateRow(i, "item_name", e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex flex-col gap-2 w-full sm:col-span-4">
                <Label className="text-xs">Qty</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={row.quantity}
                  onChange={(e) => updateRow(i, "quantity", e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2 w-full sm:col-span-4">
                <Label className="text-xs">Price ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={row.unit_price}
                  onChange={(e) => updateRow(i, "unit_price", e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2 w-full sm:col-span-4">
                <Label className="text-xs">Amount ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={row.amount}
                  onChange={(e) => updateRow(i, "amount", e.target.value)}
                  className="w-full font-bold text-primary bg-primary/[0.03]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
               <Label className="text-xs text-muted-foreground">Category</Label>
               <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                     className={cn("px-4 py-1.5 text-xs rounded-md font-semibold transition-all hover:bg-slate-200", row.category === "Labor" ? "bg-white text-primary shadow-sm hover:bg-white" : "text-muted-foreground")}
                     onClick={() => updateRow(i, "category", "Labor")}
                  >
                     Labor
                  </button>
                  <button
                     className={cn("px-4 py-1.5 text-xs rounded-md font-semibold transition-all hover:bg-slate-200", row.category === "Materials" ? "bg-white text-primary shadow-sm hover:bg-white" : "text-muted-foreground")}
                     onClick={() => updateRow(i, "category", "Materials")}
                  >
                     Materials
                  </button>
               </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs">Description</Label>
              <textarea
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Work description..."
                value={row.description}
                onChange={(e) => updateRow(i, "description", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
        <Button variant="outline" className="w-full sm:w-auto gap-2" onClick={addRow}>
          <Plus className="h-4 w-4" /> Add Row
        </Button>
        {!hideAutoCalc && (
          <Button variant="secondary" className="w-full sm:w-auto gap-2" onClick={autoCalc}>
            <Calculator className="h-4 w-4" /> Auto-calc
          </Button>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-border flex flex-col gap-4">
         <div className="flex items-center justify-between bg-slate-50/50 p-3 border border-border/40 rounded-xl">
            <h3 className="text-sm font-semibold text-foreground ml-1">Advanced Discount</h3>
            <div className="flex bg-slate-200/60 p-1 rounded-lg w-[180px]">
               <button 
                  onClick={() => {
                     setShowDiscount(false);
                     setDiscountValue(0);
                  }}
                  className={cn("flex-1 py-1.5 text-xs font-semibold rounded-md transition-all", !showDiscount ? "bg-white shadow-sm text-foreground" : "text-muted-foreground")}
               >
                   Off
               </button>
               <button 
                  onClick={() => setShowDiscount(true)}
                  className={cn("flex-1 py-1.5 text-xs font-semibold rounded-md transition-all", showDiscount ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}
               >
                   Active
               </button>
            </div>
         </div>

         {showDiscount && (
           <div className="mt-4 flex flex-col gap-4 bg-slate-50/50 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-4">
                  <div className="flex bg-slate-200/60 p-1 rounded-lg w-[200px]">
                     <button 
                        onClick={() => setDiscountMode('flat')}
                        className={cn("flex-1 py-1.5 text-xs font-semibold rounded-md transition-all", discountMode === 'flat' ? "bg-white shadow-sm text-foreground" : "text-muted-foreground")}
                     >
                         Flat Amount ($)
                     </button>
                     <button 
                        onClick={() => setDiscountMode('percent')}
                        className={cn("flex-1 py-1.5 text-xs font-semibold rounded-md transition-all", discountMode === 'percent' ? "bg-white shadow-sm text-foreground" : "text-muted-foreground")}
                     >
                         Percentage (%)
                     </button>
                  </div>
                  
                  <div className="relative">
                      <Input 
                         type="number"
                         min="0"
                         step={discountMode === 'percent' ? "1" : "0.01"}
                         value={discountValue || ""}
                         onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)}
                         className="w-32 pr-8"
                         placeholder="0"
                      />
                      <span className="absolute right-3 top-2 text-sm text-muted-foreground font-medium">
                         {discountMode === 'percent' ? "%" : "$"}
                      </span>
                  </div>
              </div>
           </div>
         )}
      </div>
    </div>
  );
}
