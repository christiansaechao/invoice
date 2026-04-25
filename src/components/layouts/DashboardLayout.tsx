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
  Palette,
  type LucideIcon,
} from "lucide-react";
import { useLogo } from "@/api/user.api";
import { useUser } from "@/store/user.store";

const navItems: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/invoices", label: "New Invoice", icon: PlusCircle },
  { to: "/dashboard/all-invoices", label: "All Invoices", icon: Receipt },
  { to: "/dashboard/clients", label: "Clients", icon: Users },
  { to: "/dashboard/templates", label: "Templates", icon: Palette },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout() {
  const { pathname } = useLocation();
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

  const navCls = `w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} gap-2`;

  return (
    <div
      className="flex min-h-screen bg-background"
      style={
        {
          "--sidebar-width": isCollapsed ? "80px" : "256px",
        } as React.CSSProperties
      }
    >
      {/* Sidebar */}
      <aside
        className={`border-r border-border p-4 flex flex-col gap-4 duration-400 transition-all ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div
          className={`flex items-center mb-4 ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-8 w-8 object-contain rounded"
                />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">
                  R
                </div>
              )}
              <div className="font-bold text-xl tracking-tight whitespace-nowrap">
                Receipt
              </div>
            </div>
          )}
          {isCollapsed && logoUrl && (
            <div className="mt-1">
              <img
                src={logoUrl}
                alt="Logo"
                className="h-8 w-8 object-contain rounded mx-auto"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex-shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Button
              key={to}
              asChild
              variant={pathname === to ? "secondary" : "ghost"}
              className={navCls}
              title={isCollapsed ? label : undefined}
            >
              <Link to={to}>
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>{label}</span>}
              </Link>
            </Button>
          ))}
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
