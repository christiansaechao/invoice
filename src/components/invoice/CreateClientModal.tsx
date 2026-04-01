import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createClient } from "@/services/invoice.services";
import { toast } from "sonner";

type CreateClientModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated: (client: any) => void;
};

export function CreateClientModal({ open, onOpenChange, onClientCreated }: CreateClientModalProps) {
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const resetForm = () => {
    setCompanyName("");
    setContactName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCity("");
    setState("");
    setZipCode("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast.error("Company Name is required!");
      return;
    }

    setLoading(true);
    const { success, error, data } = await createClient({
      company_name: companyName,
      contact_name: contactName,
      email,
      phone,
      address,
      city,
      state,
      zip_code: zipCode,
    });

    setLoading(false);

    if (!success) {
      toast.error("Failed to create client", { description: error });
      return;
    }

    toast.success("Client created successfully!");
    onClientCreated(data);
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input 
              id="companyName" 
              placeholder="Acme Corp" 
              value={companyName} 
              onChange={e => setCompanyName(e.target.value)} 
              autoFocus
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <Input 
              id="contactName" 
              placeholder="John Doe" 
              value={contactName} 
              onChange={e => setContactName(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                placeholder="(555) 123-4567" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address" 
              placeholder="123 Main St" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2 col-span-1 border-r border-border pr-3">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city" 
                placeholder="City" 
                value={city} 
                onChange={e => setCity(e.target.value)} 
              />
            </div>
            <div className="grid gap-2 col-span-1 border-r border-border pr-3">
              <Label htmlFor="state">State</Label>
              <Input 
                id="state" 
                placeholder="CA" 
                value={state} 
                onChange={e => setState(e.target.value)} 
              />
            </div>
            <div className="grid gap-2 col-span-1">
              <Label htmlFor="zipCode">Zip</Label>
              <Input 
                id="zipCode" 
                placeholder="12345" 
                value={zipCode} 
                onChange={e => setZipCode(e.target.value)} 
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Save Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
