import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpdateClient } from "@/api/client.api";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { Client } from "@/types/client.types";

interface EditClientModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onArchive: (id: string, isArchived: boolean) => void;
}

export function EditClientModal({ client, isOpen, onClose, onArchive }: EditClientModalProps) {
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [notes, setNotes] = useState<string[]>([]);
  const { mutate: updateClient, isPending } = useUpdateClient();

  useEffect(() => {
    if (client) {
      setFormData({
        company_name: client.company_name || "",
        contact_name: client.contact_name || "",
        email: client.email || "",
        industry: client.industry || "",
      });
      setNotes((client.notes as string[]) || []);
    }
  }, [client]);

  const handleNoteChange = (index: number, value: string) => {
    const updated = [...notes];
    updated[index] = value.substring(0, 50); // Enforce 50 char limit per bullet
    setNotes(updated);
  };

  const addNote = () => {
    if (notes.length < 3) {
      setNotes([...notes, ""]);
    }
  };

  const removeNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;

    updateClient(
      { 
        clientId: client.id, 
        clientData: { 
          ...formData, 
          notes: notes.filter(n => n.trim() !== "") 
        } 
      },
      {
        onSuccess: () => {
          toast.success("Client profile updated successfully");
          onClose();
        },
        onError: (err: any) => {
          toast.error(`Update failed: ${err.message || "Unknown error"}`);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8 bg-card border-border shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold tracking-tight">Edit Client Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="company_name" className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mr-auto">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name ?? ""}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="Google, Inc."
                className="rounded-xl bg-muted/30 border-border focus:bg-card transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact_name" className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mr-auto">Contact Person</Label>
              <Input
                id="contact_name"
                value={formData.contact_name ?? ""}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                placeholder="Jane Smith"
                className="rounded-xl bg-muted/30 border-border focus:bg-card transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mr-auto">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email ?? ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jane@company.com"
              className="rounded-xl bg-muted/30 border-border focus:bg-card transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="industry" className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mr-auto">Industry / Type</Label>
            <Input
              id="industry"
              value={formData.industry ?? ""}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="Tech, Home Services, etc."
              className="rounded-xl bg-muted/30 border-border focus:bg-card transition-colors"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Client Notes (Max 3)</Label>
              {notes.length < 3 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={addNote}
                  className="h-7 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/5"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Note
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {notes.map((note, index) => (
                <div key={index} className="flex gap-2 items-center group">
                  <div className="relative flex-1">
                    <Input
                      value={note}
                      onChange={(e) => handleNoteChange(index, e.target.value)}
                      placeholder={`Brief note ${index + 1}...`}
                      className="rounded-xl bg-muted/30 border-border focus:bg-card pr-12 transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-muted-foreground/60 group-focus-within:text-muted-foreground">
                      {note.length}/50
                    </span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeNote(index)}
                    className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-2">Add quick highlights or preferences for this client.</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 flex flex-col items-center gap-4">
            {client && (
               <div className="flex flex-col gap-2 w-full">
                 <Button
                   type="button"
                   variant="ghost"
                   onClick={() => {
                     onArchive(client.id, !client.is_archived);
                     onClose();
                   }}
                   className="mr-auto text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors h-12 px-4"
                 >
                   {client.is_archived ? "Restore Client" : "Archive Client"}
                 </Button>
                 {!client.is_archived && (
                   <p className="text-[9px] text-muted-foreground px-4 -mt-2">
                     Note: Archiving clients with outstanding invoices or activity in the last 30 days will still count toward your active slot limit.
                   </p>
                 )}
               </div>
            )}
            <div className="flex gap-3 w-full justify-end">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-12 px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-12 px-8 bg-primary hover:opacity-90 shadow-lg shadow-primary/20 transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
