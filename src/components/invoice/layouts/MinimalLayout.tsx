import { Header } from "../Header";
import { MetaInfo } from "../MetaInfo";
import { BillTo } from "../BillTo";
import { LineItemsTable } from "../LineItemsTable";
import { Totals } from "../Totals";
import { Footer } from "../Footer";
import { PaymentSection } from "../PaymentSection";
import { TEMPLATE_THEMES } from "@/constants/template-themes";

export function MinimalLayout({ data }: { data: any }) {
    const { invoiceNumber, date, dueDate, billToOverride, rows, hourlyRate, subtotal, total, paymentLink, status, currency } = data;
    const t = TEMPLATE_THEMES.minimal;
    
    return (
        <div className="flex flex-col w-full h-full" style={{ backgroundColor: t.bg.main, color: t.text.main }}>
            <div className="flex gap-5 justify-between items-start pt-7 px-7 pb-4 border-none">
              <Header />
              <MetaInfo
                invoiceNumber={invoiceNumber}
                date={date}
                dueDate={dueDate}
              />
            </div>

            <div className="pt-12 px-7">
              <div className="mb-12">
                <BillTo override={billToOverride} variant="minimal" />
              </div>

              <LineItemsTable rows={rows} />

              <Totals
                hourlyRate={hourlyRate}
                subtotal={subtotal}
                discount={0}
                tax={0}
                total={total}
              />

              <PaymentSection 
                paymentLink={paymentLink} 
                status={status} 
                total={total} 
                currency={currency} 
                templateSlug="minimal" 
              />
            </div>

            <Footer />
        </div>
    );
}
