import { useState, useRef, useEffect } from "react";
import type { InvoiceStatus } from "@/types/invoice.types";
import { STATUS_TRANSITIONS, TRANSITION_LABELS } from "@/lib/invoice-status";

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
  draft: {
    label: "Draft",
    barClass: "bg-amber-500",
    pillClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    amountClass: "text-foreground",
  },
  void: {
    label: "Void",
    barClass: "bg-muted",
    pillClass: "bg-muted text-muted-foreground",
    amountClass: "text-muted-foreground line-through",
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

  const transitions = STATUS_TRANSITIONS[status] ?? [];
  const hasTransitions = transitions.length > 0;

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => hasTransitions && !disabled && setIsOpen((o) => !o)}
        disabled={disabled || !hasTransitions}
        className={`
          w-[110px] flex-shrink-0 appearance-none text-center
          text-[10px] font-bold tracking-widest uppercase
          px-2.5 py-1.5 rounded-full border border-transparent outline-none transition-all
          ${(disabled || !hasTransitions) ? "opacity-50 cursor-not-allowed" : "hover:opacity-85 cursor-pointer shadow-sm"}
          ${cfg.pillClass}
        `}
      >
        {cfg.label}
      </button>

      {isOpen && !disabled && hasTransitions && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[140px] bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden flex flex-col p-1.5 gap-1 animate-in fade-in zoom-in-95 duration-100">
          {transitions.map((st) => {
             const sc = STATUS_CONFIG[st];
             const label = TRANSITION_LABELS[st] ?? sc.label;
             return (
               <button
                 key={st}
                 onClick={() => handleSelect(st)}
                 className={`
                   text-[10px] font-bold tracking-widest uppercase text-center
                   w-full py-2 px-2 rounded-lg transition-colors border
                   bg-transparent border-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground
                 `}
               >
                 {label}
               </button>
             );
          })}
        </div>
      )}
    </div>
  );
}
