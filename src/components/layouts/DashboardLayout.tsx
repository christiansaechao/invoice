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
  PanelLeftOpen,
  Users,
  Palette
} from "lucide-react";
import { useLogo } from "@/api/user.api";
import { useUser } from "@/store/user.store";

export function DashboardLayout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { session } = useUser();
  const { data: logoUrl } = useLogo(session?.user?.id ?? undefined);

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err: unknown) {
      throw new Error("An error occurred while signing out" + err);
    }
  }

  return (
    <div 
      className="flex min-h-screen bg-background"
      style={{ "--sidebar-width": isCollapsed ? "80px" : "256px" } as React.CSSProperties}
    >
      {/* Sidebar */}
      <aside
        className={`border-r border-border p-4 flex flex-col gap-4 duration-400 transition-all ${isCollapsed ? "w-20" : "w-64"
          }`}
      >
        <div className={`flex items-center mb-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-8 w-8 object-contain rounded" />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">
                  R
                </div>
              )}
              <div className="font-bold text-xl tracking-tight whitespace-nowrap">
                Reciept
              </div>
            </div>
          )}
          {isCollapsed && logoUrl && (
            <div className="mt-1">
              <img src={logoUrl} alt="Logo" className="h-8 w-8 object-contain rounded mx-auto" />
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
          <Link to="/dashboard/invoices">
            <Button
              variant={location.pathname === "/dashboard/invoices" ? "secondary" : "ghost"}
              className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} gap-2`}
              title={isCollapsed ? "New Invoice" : undefined}
            >
              <PlusCircle className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>New Invoice</span>}
            </Button>
          </Link>
          <Link to="/dashboard/all-invoices">
            <Button
              variant={location.pathname === "/dashboard/all-invoices" ? "secondary" : "ghost"}
              className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} gap-2`}
              title={isCollapsed ? "Invoices" : undefined}
            >
              <Receipt className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>All Invoices</span>}
            </Button>
          </Link>
          <Link to="/dashboard/clients">
            <Button
              variant={location.pathname === "/dashboard/clients" ? "secondary" : "ghost"}
              className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} gap-2`}
              title={isCollapsed ? "Clients" : undefined}
            >
              <Users className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Clients</span>}
            </Button>
          </Link>
          <Link to="/dashboard/templates">
            <Button
              variant={location.pathname === "/dashboard/templates" ? "secondary" : "ghost"}
              className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} gap-2`}
              title={isCollapsed ? "Templates" : undefined}
            >
              <Palette className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Templates</span>}
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
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
