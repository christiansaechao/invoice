import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

export function DashboardLayout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      {/* Sidebar */}
      <aside
        className={`border-r border-border p-4 flex flex-col gap-4 duration-400 transition-all ${isCollapsed ? "w-20" : "w-64"
          }`}
      >
        <div className={`flex items-center mb-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <div className="font-bold text-xl tracking-tight overflow-hidden whitespace-nowrap">
              Pay That Man
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex-shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex flex-col gap-2">
          <Link to="/dashboard">
            <Button
              variant={location.pathname === "/dashboard" ? "secondary" : "ghost"}
              className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} gap-2`}
              title={isCollapsed ? "Dashboard" : undefined}
            >
              <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </Button>
          </Link>
          <Link to="/dashboard/all-invoices">
            <Button
              variant={location.pathname === "/dashboard/all-invoices" ? "secondary" : "ghost"}
              className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} gap-2`}
              title={isCollapsed ? "Invoices" : undefined}
            >
              <Receipt className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Invoices</span>}
            </Button>
          </Link>
          <Link to="/dashboard/invoices/new">
            <Button
              variant={location.pathname === "/dashboard/invoices/new" ? "secondary" : "ghost"}
              className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} gap-2`}
              title={isCollapsed ? "New Invoice" : undefined}
            >
              <PlusCircle className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>New Invoice</span>}
            </Button>
          </Link>
          <Link to="/dashboard/settings">
            <Button
              variant={location.pathname === "/dashboard/settings" ? "secondary" : "ghost"}
              className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} gap-2`}
              title={isCollapsed ? "Settings" : undefined}
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Settings</span>}
            </Button>
          </Link>
        </nav>

        <div className="mt-auto">
          <Button
            variant="outline"
            className={`w-full ${isCollapsed ? "justify-center px-0" : ""} gap-2`}
            onClick={signOut}
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
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
