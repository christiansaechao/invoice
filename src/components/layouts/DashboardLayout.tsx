import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";

export function DashboardLayout() {
  const location = useLocation();

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err: unknown) {
      throw new Error("An error occurred while signing out" + err);
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - simplified for now */}
      <aside className="w-64 border-r border-border p-6 flex flex-col gap-4">
        <div className="font-bold text-xl tracking-tight mb-4">
          Pay That Man
        </div>

        <nav className="flex flex-col gap-2">
          <Link to="/dashboard">
            <Button
              variant={
                location.pathname === "/dashboard" ? "secondary" : "ghost"
              }
              className="w-full justify-start"
            >
              Dashboard
            </Button>
          </Link>
          <Link to="/dashboard/all-invoices">
            <Button
              variant={
                location.pathname === "/dashboard/all-invoices"
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-start"
            >
              Invoices
            </Button>
          </Link>
          <Link to="/dashboard/invoices/new">
            <Button
              variant={
                location.pathname === "/dashboard/invoices/new"
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-start"
            >
              New Invoice
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" className="w-full justify-start">
              Settings
            </Button>
          </Link>
        </nav>

        <div className="mt-auto">
          <Button variant="outline" className="w-full" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
