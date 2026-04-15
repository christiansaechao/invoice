// import { useSettings } from "@/store/settings.store";
import { toast } from "sonner";
import { Image as ImageIcon, Plus } from "lucide-react";
import { useLogoUpload } from "@/api/user.api";
import { useUser } from "@/store/user.store";
import { useLogo } from "@/api/user.api";

export function BrandAssetsSection() {
  const { session } = useUser();
  const logoUpdateMutation = useLogoUpload();
  const { data: logoUrl } = useLogo(session?.user?.id ?? undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo file is too large (max 2MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (!session?.user?.id) return;
      logoUpdateMutation.mutateAsync({ file, userId: session?.user?.id });
      toast.success("Logo uploaded successfully");
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-6 bg-card border border-border p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <ImageIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Brand Assets</h2>
          <p className="text-sm text-muted-foreground">Upload your logo to appear on all invoices.</p>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        {logoUrl ? (
          <div className="relative group">
            <img src={logoUrl} alt="Brand Logo" className="max-h-24 object-contain rounded-lg" />
            <button
              className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <Plus className="h-3.5 w-3.5 rotate-45" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100">
              <Plus className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">Upload Logo</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-bold">Supported: PNG, JPG (Max 2MB)</p>
    </div>
  );
}
