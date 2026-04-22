import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/constants/pricing";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-900 pr-4">{q}</span>
        <ChevronDown
          className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="px-6 md:px-12 max-w-4xl mx-auto pb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#6200EE]">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {FAQ_ITEMS.map((item) => (
          <FaqItem key={item.q} q={item.q} a={item.a} />
        ))}
      </div>
    </section>
  );
}
