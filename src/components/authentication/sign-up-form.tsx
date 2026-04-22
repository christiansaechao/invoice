import { cn } from '@/utils/utils';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Landmark, ShieldCheck, BarChart3, Globe2, LogIn } from 'lucide-react';

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!termsAccepted) {
      setError('You must accept the terms and conditions.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstname,
            last_name: lastname,
          },
        },
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-serif text-zinc-900 mb-2">
            Check your email
          </h2>
          <p className="text-zinc-600 mb-6">
            We've sent a confirmation link to <strong>{email}</strong>. Please
            click the link to activate your account.
          </p>
          <Button
            className="w-full bg-zinc-900 text-white"
            onClick={() => (location.href = '/login')}
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-900',
        className,
      )}
      {...props}
    >
      {/* Navbar */}
      <nav className="border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="h-6 w-6 text-zinc-900" />
            <span className="font-serif text-xl font-medium tracking-tight">
              Reciept
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a href="#" className="hover:text-zinc-900">
              Features
            </a>
            <a href="#" className="hover:text-zinc-900">
              Pricing
            </a>
            <a href="#" className="hover:text-zinc-900">
              Help
            </a>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-zinc-500 hidden sm:inline">
              Already have an account?
            </span>
            <a href="/login" className="text-zinc-900 hover:text-blue-700">
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16 items-start justify-center">
        {/* Left Column: Value Prop */}
        <div className="flex-1 lg:max-w-xl pt-8 space-y-12">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight leading-tight text-zinc-900">
              Create, Save, and Send Invoices in Minutes
            </h1>
            <p className="text-lg text-zinc-600 font-light italic">
              Reciept helps you create, update, and store invoices—then export a
              clean PDF whenever you need it.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 mb-1">
                  Fast invoice creation
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Build professional invoices with client details, line items,
                  tax, and totals—no spreadsheet needed.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 mb-1">
                  Edit and reuse invoices
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Update invoices anytime, duplicate past ones, and keep
                  everything organized in one place.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Globe2 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 mb-1">
                  Export to PDF
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Download a polished PDF version of any invoice to send to
                  clients or keep for your records.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Card */}
        <div className="w-full max-w-md shrink-0">
          <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 p-8 border border-zinc-100">
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-medium text-zinc-900">
                Create your account
              </h2>
              <p className="text-sm text-zinc-500 mt-2 font-serif italic">
                Start creating invoices and exporting PDFs right away.
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="firstname"
                  className="text-xs uppercase font-bold tracking-wider text-zinc-500"
                >
                  First Name
                </Label>
                <Input
                  id="firstname"
                  placeholder="Johnathan"
                  className="bg-zinc-50 border-zinc-200 h-11 focus:bg-white transition-colors"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastname"
                  className="text-xs uppercase font-bold tracking-wider text-zinc-500"
                >
                  Last Name
                </Label>
                <Input
                  id="lastname"
                  placeholder="Doe"
                  className="bg-zinc-50 border-zinc-200 h-11 focus:bg-white transition-colors"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs uppercase font-bold tracking-wider text-zinc-500"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="j.doe@company.com"
                  className="bg-zinc-50 border-zinc-200 h-11 focus:bg-white transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs uppercase font-bold tracking-wider text-zinc-500"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-zinc-50 border-zinc-200 h-11 focus:bg-white transition-colors text-xl tracking-widest placeholder:text-zinc-400 placeholder:text-sm placeholder:tracking-normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-[10px] text-zinc-400 uppercase tracking-wide font-medium">
                  Use 8+ characters for a strong password
                </p>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                </div>
                <label
                  htmlFor="terms"
                  className="text-xs text-zinc-500 leading-normal"
                >
                  I agree to the{' '}
                  <a href="#" className="underline text-zinc-900 font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="underline text-zinc-900 font-medium">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              {error && (
                <p className="text-xs font-medium text-red-600 bg-red-50 p-2 rounded border border-red-100">
                  {error}
                </p>
              )}

              <Button
                className="w-full h-12 bg-zinc-900 hover:bg-zinc-700 text-white font-medium tracking-wide uppercase text-xs cursor-pointer"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-white px-2 text-zinc-400 font-medium">
                  More sign-in options
                </span>
              </div>
            </div>

            <Button
              // variant="outline"
              // className="w-full h-12 border-zinc-200 text-zinc-900 hover:bg-zinc-50 font-medium flex items-center justify-center gap-2"
              className="w-full h-12 border-zinc-200 bg-white shadow-sm cursor-pointer hover:bg-zinc-50 hover:text-[#6200EE] hover:scale-102 active:bg-zinc-100"
            >
              <LogIn className="h-4 w-4" />
              Continue with Google
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest font-medium text-zinc-400">
          <p>
            &copy; {new Date().getFullYear()} Reciept Inc. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-zinc-600">
              Terms
            </a>
            <a href="#" className="hover:text-zinc-600">
              Privacy
            </a>
            <a href="#" className="hover:text-zinc-600">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
