import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, FileText, Receipt, Globe, BarChart } from "lucide-react";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

export function LandingPage() {
  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.from("profiles").select("*");
      console.log("data: ", data);
      console.log("erro: ", error);
    }

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="px-6 md:px-12 h-20 flex items-center justify-between border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground rounded-lg p-2">
            <Receipt className="h-5 w-5" />
          </div>
          <div className="font-serif font-bold text-2xl tracking-tight text-primary">
            Pay That Man
          </div>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link to="#" className="hover:text-foreground transition-colors">
            Solutions
          </Link>
          <Link to="#" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link to="#" className="hover:text-foreground transition-colors">
            Resources
          </Link>
          <Link to="#" className="hover:text-foreground transition-colors">
            Enterprise
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium hover:text-foreground transition-colors"
          >
            Login
          </Link>
          <Link to="/sign-up">
            <Button className="rounded-full px-6 font-medium">
              Open an Account
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Now Available for Small Business
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-medium leading-[1.1] text-primary">
              Invoicing Made <br />
              <span className="italic">Simple.</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Create, track, and manage your invoices with professional tools
              designed for freelancers and growing small businesses. Reliability
              you can trust.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/sign-up">
                <Button size="lg" className="rounded-full px-8 h-12 text-base">
                  Get Started for Free
                </Button>
              </Link>
              <Link to="/demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 h-12 text-base"
                >
                  View Demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 text-blue-600 rounded-full p-0.5">
                  <Check className="h-3 w-3" />
                </div>
                Custom branded invoices
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 text-blue-600 rounded-full p-0.5">
                  <Check className="h-3 w-3" />
                </div>
                Recurring invoices + payment tracking
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Abstract image placeholder since we can't generate the real office photo */}
            <div className="aspect-4/3 rounded-2xl overflow-hidden bg-muted relative shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
                alt="Modern Office"
                className="w-full h-full object-cover"
              />

              {/* Floating Card */}
              <div className="absolute bottom-8 left-5 bg-white p-4 rounded-xl shadow-xl border border-border flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-1000">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-primary">
                    Invoice Paid
                  </div>
                  <div className="text-xs text-muted-foreground">
                    $2,450.00 from Acme Corp
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logos */}
        <section className="py-12 border-y border-border/40 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-8">
              Trusted by 50,000+ Growing Companies
            </p>
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <h3 className="text-xl font-serif font-bold text-primary">
                HORIZON
              </h3>
              <h3 className="text-xl font-serif font-bold italic text-primary">
                Vantage
              </h3>
              <h3 className="text-xl font-serif font-bold text-primary">
                NEXUS
              </h3>
              <h3 className="text-xl font-serif font-bold text-primary">
                AURORA
              </h3>
              <h3 className="text-xl font-serif font-bold text-primary">
                ZENITH
              </h3>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-primary">
              Precision Engineering for Modern Finance
            </h2>
            <p className="text-muted-foreground text-lg">
              Refined tools that remove the friction from your daily financial
              operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="h-6 w-6" />,
                title: "Professional Invoicing",
                desc: "Customize white-label invoices that reflect your brand's prestige and professionalism.",
              },
              {
                icon: <BarChart className="h-6 w-6" />,
                title: "Smart Analytics",
                desc: "Gain deep insights into your cash flow with institutional-grade reporting and forecasting.",
              },
              {
                icon: <Globe className="h-6 w-6" />,
                title: "Global Payments",
                desc: "Accept payments from anywhere in the world with integrated multi-currency support.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground pt-16 pb-2 px-6 flex flex-col items-center md:px-12">
        <div className="max-w-7xl w-full mx-auto flex flex-row justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
              <span className="font-serif font-bold text-xl">Pay That Man</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              The definitive invoicing partner for professional services and
              enterprise-level freelancers.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm tracking-wider uppercase">
              Platform
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="hover:text-white cursor-pointer">How it works</li>
              <li className="hover:text-white cursor-pointer">Pricing</li>
              <li className="hover:text-white cursor-pointer">Security</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm tracking-wider uppercase">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
              <li className="hover:text-white cursor-pointer">Privacy</li>
              <li className="hover:text-white cursor-pointer">Terms</li>
            </ul>
          </div>
        </div>
        <div className="col-span-1 text-right md:text-left">
          <div className="text-xs text-primary-foreground/50 mt-12 md:mt-0">
            &copy; {new Date().getFullYear()} Pay That Man Inc. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
