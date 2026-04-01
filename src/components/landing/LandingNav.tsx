import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";
import { BRAND_NAME } from "@/constants/pricing";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
];

export function LandingNav() {
  return (
    <header className="px-6 md:px-12 h-20 flex items-center justify-between border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-primary text-primary-foreground rounded-lg p-2">
          <Receipt className="h-5 w-5" />
        </div>
        <span className="font-serif font-bold text-2xl tracking-tight text-primary">
          {BRAND_NAME}
        </span>
      </Link>

      <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
        {NAV_LINKS.map((link) => (
          <Link key={link.label} to={link.href} className="hover:text-foreground transition-colors">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm font-medium hover:text-foreground transition-colors">
          Log In
        </Link>
        <Link to="/sign-up">
          <Button className="rounded-full px-6 font-medium">Get Started</Button>
        </Link>
      </div>
    </header>
  );
}
