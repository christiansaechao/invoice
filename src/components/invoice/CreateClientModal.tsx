import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCreateClient } from "@/api/client.api";
import { toast } from "sonner";

const clientSchema = z.object({
  contact_name: z.string().min(1, "Contact name is required"),
  email: z.string().email("Please enter a valid email address"),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  industry: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

type CreateClientModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated: (client: any) => void;
};

export function CreateClientModal({
  open,
  onOpenChange,
  onClientCreated,
}: CreateClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const createClientMutation = useCreateClient();

  // Form State
  const [formData, setFormData] = useState<ClientFormData>({
    contact_name: "",
    email: "",
    company_name: "",
    phone: "",
    industry: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ClientFormData, string>>
  >({});

  const resetForm = () => {
    setFormData({
      contact_name: "",
      email: "",
      company_name: "",
      phone: "",
      industry: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
    });
    setErrors({});
    setShowAdvanced(false);
  };

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time validation for email
    if (field === "email") {
      const emailResult = z.string().email().safeParse(value);
      setErrors((prev) => ({
        ...prev,
        email:
          !emailResult.success && value.length > 0
            ? "Please enter a valid email address"
            : undefined,
      }));
    } else {
      // Clear error when user types in other fields
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate entire form before submission
    const result = clientSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: Partial<Record<keyof ClientFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0] as keyof ClientFormData] = err.message;
        }
      });
      setErrors(formattedErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      setLoading(true);
      const response = await createClientMutation.mutateAsync(result.data);

      if (response && response.success === false) {
        toast.error("Failed to create client", { description: response.error });
        setLoading(false);
        return;
      }

      toast.success("Client created successfully!");
      onClientCreated(response);
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error("Failed to create client", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Add New Client
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
          {/* Primary Fields Section */}
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label
                htmlFor="contact_name"
                className="text-foreground font-medium"
              >
                Contact Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact_name"
                placeholder="Jane Doe"
                value={formData.contact_name}
                onChange={(e) =>
                  handleInputChange("contact_name", e.target.value)
                }
                autoFocus
                className={
                  errors.contact_name
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.contact_name && (
                <span className="text-sm text-destructive">
                  {errors.contact_name}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={
                  errors.email
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.email && (
                <span className="text-sm text-destructive">{errors.email}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="company_name"
                className="text-foreground font-medium"
              >
                Company Name
              </Label>
              <Input
                id="company_name"
                placeholder="Acme Corp (Optional)"
                value={formData.company_name}
                onChange={(e) =>
                  handleInputChange("company_name", e.target.value)
                }
              />
            </div>
          </div>

          {/* Advanced Details Toggle */}
          <div className="flex items-center space-x-2 pt-2 border-t border-border">
            <Switch
              id="advanced-details"
              checked={showAdvanced}
              onCheckedChange={setShowAdvanced}
            />
            <Label
              htmlFor="advanced-details"
              className="text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            >
              Advanced Details
            </Label>
          </div>

          {/* Advanced Fields Section */}
          {showAdvanced && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="E-commerce, Tech, etc."
                    value={formData.industry}
                    onChange={(e) =>
                      handleInputChange("industry", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2 col-span-1">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div className="grid gap-2 col-span-1">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="CA"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>
                <div className="grid gap-2 col-span-1">
                  <Label htmlFor="zip_code">Zip Code</Label>
                  <Input
                    id="zip_code"
                    placeholder="12345"
                    value={formData.zip_code}
                    onChange={(e) =>
                      handleInputChange("zip_code", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6 sm:justify-end gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Saving..." : "Save & Select"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
