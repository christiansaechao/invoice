import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import type { InvoicesWithTotals } from "@/types/invoice.types";

interface RecentInvoicesCardProps {
  invoices: InvoicesWithTotals[];
  isLoading: boolean;
}

export function RecentInvoicesCard({ invoices, isLoading }: RecentInvoicesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Recent Invoices</CardTitle>
        <Link
          to="/dashboard/all-invoices"
          className="text-sm font-semibold text-primary hover:opacity-70 transition-opacity flex items-center gap-1"
        >
          View All <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <InvoiceTable
          invoices={invoices}
          isLoading={isLoading}
          limit={4}
          showEdit={false}
          readOnlyStatus={true}
          emptyMessage="No invoices yet. Create one to get started!"
          onToggleStatus={() => {}}
          onEdit={() => { }}
        />
      </CardContent>
    </Card>
  );
}
