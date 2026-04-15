import { useState, useEffect } from "react";
import { useUser } from "@/store/user.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { useFetchProfile, useUpdateProfile } from "@/api/user.api";

export function FromDetailsSection() {
  const { session } = useUser();
  const { data: profile } = useFetchProfile(session?.user?.id);
  const updateProfileMutation = useUpdateProfile();
  const [savingFrom, setSavingFrom] = useState(false);

  const [fromInfo, setFromInfo] = useState({
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    state: "",
    area_code: "",
    phone_number: "",
    preferred_email: "",
  });

  const handleSaveFrom = async () => {
    if (!session?.user?.id) return;
    setSavingFrom(true);

    try {
      await updateProfileMutation.mutateAsync({
        userId: session.user.id,
        updates: fromInfo,
      });

      toast.success("Profile saved successfully");
    } catch (error: any) {
      toast.error("Failed to update profile: " + error.message);
    } finally {
      setSavingFrom(false);
    }
  };

  useEffect(() => {
    if (profile) {
      setFromInfo({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        area_code: profile.area_code || "",
        phone_number: profile.phone_number || "",
        preferred_email: profile.preferred_email || "",
      });
    }
  }, [profile]);

  return (
    <div className="flex flex-col gap-6 bg-card border border-border p-6 rounded-xl shadow-sm">
      <div>
        <h2 className="text-xl font-bold tracking-tight">"From" Details</h2>
        <p className="text-sm text-muted-foreground">Your primary business information shown on invoices.</p>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>First Name</Label>
            <Input value={fromInfo.first_name} onChange={e => setFromInfo({ ...fromInfo, first_name: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label>Last Name</Label>
            <Input value={fromInfo.last_name} onChange={e => setFromInfo({ ...fromInfo, last_name: e.target.value })} />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Email</Label>
          <Input type="email" value={fromInfo.preferred_email} onChange={e => setFromInfo({ ...fromInfo, preferred_email: e.target.value })} />
        </div>

        <div className="grid gap-2">
          <Label>Address</Label>
          <Input value={fromInfo.address} onChange={e => setFromInfo({ ...fromInfo, address: e.target.value })} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2 col-span-2">
            <Label>City</Label>
            <Input value={fromInfo.city} onChange={e => setFromInfo({ ...fromInfo, city: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label>State</Label>
            <Input value={fromInfo.state} onChange={e => setFromInfo({ ...fromInfo, state: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Zip/Area Code</Label>
            <Input inputMode="numeric" value={fromInfo.area_code} onChange={e => setFromInfo({ ...fromInfo, area_code: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label>Phone</Label>
            <Input type="tel" value={fromInfo.phone_number} onChange={e => setFromInfo({ ...fromInfo, phone_number: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Button onClick={handleSaveFrom} disabled={savingFrom} className="w-full gap-2">
          {savingFrom ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save "From" Info
        </Button>
      </div>
    </div>
  );
}
