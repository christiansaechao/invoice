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
  return (
    <div className="text-right min-w-[280px]">
      <div className="inline-block py-1.5 px-2.5 bg-secondary text-secondary-foreground border border-border rounded-full text-xs mb-3 font-semibold tracking-wider">
        INVOICE
      </div>
      <div className="flex justify-end items-center gap-3 my-1.5 text-sm">
        <label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Invoice #</label>
        <div className="font-medium">{invoiceNumber}</div>
      </div>
      <div className="flex justify-end items-center gap-3 my-1.5 text-sm">
        <label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Invoice Date</label>
        <div className="font-medium">{date}</div>
      </div>
      <div className="flex justify-end items-center gap-3 my-1.5 text-sm">
        <label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Due Date</label>
        <div className="font-medium">{dueDate}</div>
      </div>
    </div>
  );
}
