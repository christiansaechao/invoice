type MetaInfoProps = {
  invoiceNumber: string;
  setInvoiceNumber: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  dueDate: string;
  setDueDate: (val: string) => void;
};

export function MetaInfo({
  invoiceNumber,
  setInvoiceNumber,
  date,
  setDate,
  dueDate,
  setDueDate,
}: MetaInfoProps) {
  return (
    <div className="meta">
      <div className="badge">INVOICE</div>
      <div className="row">
        <label htmlFor="invno">Invoice #</label>
        <input
          id="invno"
          placeholder="INV-0001"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
        />
      </div>
      <div className="row">
        <label htmlFor="date">Invoice Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="row">
        <label htmlFor="due">Due Date</label>
        <input
          id="due"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
    </div>
  );
}
