import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useSettings } from "@/store/settings.store";

export function RootLayout() {
  const { theme } = useSettings();

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (effectiveTheme: "light" | "dark") => {
      root.classList.remove("light", "dark");
      root.classList.add(effectiveTheme);
    };

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      applyTheme(systemTheme);

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
