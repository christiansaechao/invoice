import { FileText } from "lucide-react";
import { BRAND_NAME, BRAND_TAGLINE } from "@/constants/pricing";

const FOOTER_LINKS = {
  Platform: ["How it works", "Pricing", "Security"],
  Company:  ["About Us", "Contact", "Privacy", "Terms"],
};

export function LandingFooter() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-6 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="space-y-3 max-w-xs">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-1.5 rounded-lg">
              <FileText className="h-4 w-4" />
            </div>
            <span className="font-serif font-bold text-xl">{BRAND_NAME}</span>
          </div>
          <p className="text-primary-foreground/60 text-sm leading-relaxed">
            {BRAND_TAGLINE}
          </p>
        </div>

        <div className="flex gap-16">
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-bold mb-5 text-xs tracking-wider uppercase">{heading}</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/60">
                {links.map((link) => (
                  <li key={link} className="hover:text-white cursor-pointer transition-colors">{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-xs text-primary-foreground/40 flex justify-between items-center">
        <span>© {new Date().getFullYear()} {BRAND_NAME} Inc. All rights reserved.</span>
        <div className="flex gap-6">
          <span className="hover:text-white/60 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-white/60 cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-white/60 cursor-pointer transition-colors">Security</span>
          <span className="hover:text-white/60 cursor-pointer transition-colors">Contact</span>
        </div>
      </div>
    </footer>
  );
}
