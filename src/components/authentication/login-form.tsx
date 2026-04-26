import { cn } from "@/utils/utils";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Landmark, CheckCircle2, ArrowRight } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // set remember device preference
    localStorage.setItem("dongma-remember-device", rememberMe ? "true" : "false");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // User already has an active session here.
      location.href = "/dashboard";
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0",
        className,
      )}
      {...props}
    >
      {/* Left Panel */}
      <div className="relative hidden h-full flex-col bg-slate-950 p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-[#0a0a0b]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30" />

        <div className="relative z-20 flex items-center text-lg font-medium">
          <Landmark className="mr-2 h-6 w-6 text-[#6200EE]" />
          Reciept
        </div>

        <div className="relative z-20 mt-auto mb-auto">
          <h1 className="text-4xl font-serif font-medium tracking-tight mb-4">
            Pick up where you left off—
            <span className="italic">invoicing made simple.</span>
          </h1>

          <blockquote className="space-y-2 mb-8 text-lg">
            <p>
              "Clean invoices, quick edits, and one-click PDF exports. It’s
              exactly what I needed."
            </p>
          </blockquote>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#6200EE] fill-[#6200EE]/20" />
              <span className="text-sm font-medium">
                Create and save invoices in minutes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#6200EE] fill-[#6200EE]/20" />
              <span className="text-sm font-medium">
                Export a polished PDF anytime
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-20 mt-auto">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Reciept Inc. All rights
            reserved.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="lg:p-8 bg-white h-full flex flex-col justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-87.5">
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-4xl font-serif font-medium tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 italic">
              Sign in to create, edit, and export invoices.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="email"
                    className="uppercase text-xs font-bold text-slate-500 tracking-wider"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="bg-slate-50 border-slate-200 h-11 text-slate-900 placeholder:text-slate-400"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="uppercase text-xs font-bold text-slate-500 tracking-wider"
                    >
                      Password
                    </Label>
                    <a
                      href="/forgot-password"
                      className="ml-auto inline-block text-xs text-[#6200EE] font-semibold hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="bg-slate-50 border-slate-200 h-11 text-2xl tracking-widest text-slate-900 placeholder:text-slate-400/50 placeholder:text-sm placeholder:tracking-normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-slate-200 text-[#6200EE] cursor-pointer accent-[#6200EE]"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium text-slate-500 cursor-pointer"
                  >
                    Remember this device
                  </label>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  type="submit"
                  className="w-full h-11 bg-[#6200EE] hover:bg-[#6200EE]/90 text-white font-bold"
                  disabled={isLoading}
                  style={{ backgroundColor: "#6200EE", color: "white" }}
                >
                  {isLoading ? (
                    "Signing in..."
                  ) : (
                    <span className="flex items-center justify-center gap-2 cursor-pointer">
                      Sign In <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>

            <div className="text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <a
                href="/sign-up"
                className="font-bold text-[#6200EE] hover:underline"
              >
                Create one
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-0 left-0 lg:left-1/2 flex justify-center gap-8 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
          <a href="#" className="hover:text-slate-900 transition-colors">
            Privacy
          </a>
          <span>-</span>
          <a href="#" className="hover:text-slate-900 transition-colors">
            Terms
          </a>
          <span>-</span>
          <a href="#" className="hover:text-slate-900 transition-colors">
            Support
          </a>
        </div>
      </div>
    </div>
  );
}
