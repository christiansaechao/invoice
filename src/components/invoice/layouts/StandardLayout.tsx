import { Header } from "../Header";
import { MetaInfo } from "../MetaInfo";
import { BillTo } from "../BillTo";
import { FromInfo } from "../FromInfo";
import { LineItemsTable } from "../LineItemsTable";
import { Totals } from "../Totals";
import { Footer } from "../Footer";

export function StandardLayout({ data }: { data: any }) {
    const { invoiceNumber, date, dueDate, billToOverride, rows, hourlyRate, subtotal, total } = data;
    
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex gap-5 justify-between items-start pt-7 px-7 pb-4 border-b border-border/40 bg-white/30">
              <Header />
              <MetaInfo
                invoiceNumber={invoiceNumber}
                date={date}
                dueDate={dueDate}
              />
            </div>

            <div className="pt-5 px-7 pb-2.5">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <BillTo override={billToOverride} />
                <FromInfo />
              </div>

              <LineItemsTable rows={rows} />

              <Totals
                hourlyRate={hourlyRate}
                subtotal={subtotal}
                discount={0}
                tax={0}
                total={total}
              />
            </div>

            <Footer />
        </div>
    );
}
