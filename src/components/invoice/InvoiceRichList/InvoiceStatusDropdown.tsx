import { useState, useRef, useEffect } from "react";
import type { InvoiceStatus } from "@/types/invoice.types";

export const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; barClass: string; pillClass: string; amountClass: string }
> = {
  paid: {
    label: "Paid",
    barClass: "bg-secondary-foreground",
    pillClass: "bg-secondary text-secondary-foreground",
    amountClass: "text-foreground",
  },
  pending: {
    label: "Pending",
    barClass: "bg-border",
    pillClass: "bg-muted text-muted-foreground",
    amountClass: "text-foreground",
  },
  overdue: {
    label: "Overdue",
    barClass: "bg-destructive",
    pillClass: "bg-destructive text-destructive-foreground",
    amountClass: "text-destructive",
  },
};

export interface StatusDropdownProps {
  status: InvoiceStatus;
  disabled: boolean;
  onChange: (next: InvoiceStatus) => void;
}

export function StatusDropdown({ status, disabled, onChange }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cfg = STATUS_CONFIG[status];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (next: InvoiceStatus) => {
    if (next !== status) {
      onChange(next);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => !disabled && setIsOpen((o) => !o)}
        disabled={disabled}
        className={`
          w-[110px] flex-shrink-0 appearance-none text-center
          text-[10px] font-bold tracking-widest uppercase
          px-2.5 py-1.5 rounded-full border border-transparent outline-none transition-all
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-85 cursor-pointer shadow-sm"}
          ${cfg.pillClass}
        `}
      >
        {cfg.label}
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[120px] bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden flex flex-col p-1.5 gap-1 animate-in fade-in zoom-in-95 duration-100">
          {(["paid", "pending"] as InvoiceStatus[]).map((st) => {
             const sc = STATUS_CONFIG[st];
             const isSelected = status === st;
             return (
               <button
                 key={st}
                 onClick={() => handleSelect(st)}
                 className={`
                   text-[10px] font-bold tracking-widest uppercase text-center
                   w-full py-2 px-2 rounded-lg transition-colors border
                   ${isSelected 
                      ? `${sc.pillClass} border-transparent` 
                      : "bg-transparent border-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                   }
                 `}
               >
                 {sc.label}
               </button>
             );
          })}
        </div>
      )}
    </div>
  );
}
