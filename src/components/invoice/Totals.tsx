type TotalsProps = {
  hourlyRate: string;
  setHourlyRate: (val: string) => void;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
};

// Helper for currency formatting
const money = (n: number) => {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
};

export function Totals({
  hourlyRate,
  setHourlyRate,
  subtotal,
  discount,
  tax,
  total,
}: TotalsProps) {
  return (
    <div className="totals w-full">
      {/* <div className="card">
        <h2>Notes / Terms</h2>
        <textarea
          className="w-full"
          placeholder="Payment terms, late fees, bank details, thank you note, etc."
        ></textarea>
      </div> */}

      <div className="box">
        <h3>Summary</h3>

        <div className="sumrow">
          <label>Hourly Rate</label>
          <input
            id="hourlyRate"
            type="number"
            min="0"
            step="0.01"
            placeholder="24.00"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>

        <div className="sumrow">
          <label>Subtotal</label>
          <div id="subtotal" className="num">
            {money(subtotal)}
          </div>
        </div>
        {/* <div className="sumrow">
          <label>Discount</label>
          <div id="discount" className="num">
            {money(discount)}
          </div>
        </div> */}
        {/* <div className="sumrow">
          <label>Tax</label>
          <div id="tax" className="num">
            {money(tax)}
          </div>
        </div> */}
        <div className="sumrow grand">
          <label>
            <strong>Total</strong>
          </label>
          <div id="total" className="num">
            <strong>{money(total)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
