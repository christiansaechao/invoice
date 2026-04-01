import type { Row } from "@/types/entries.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Calculator } from "lucide-react";

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

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-col gap-2 w-full">
                <Label className="text-xs">Date</Label>
                <Input
                  type="date"
                  value={row.work_date}
                  onChange={(e) => updateRow(i, "work_date", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label className="text-xs">Hours</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="0"
                  value={row.hours}
                  onChange={(e) => updateRow(i, "hours", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label className="text-xs">Amount ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={row.amount_owed}
                  onChange={(e) => updateRow(i, "amount_owed", e.target.value)}
                />
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
    </div>
  );
}
