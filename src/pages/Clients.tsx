import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Wizard, type WizardStep } from "@/components/Wizard";
import { useAppData } from "@/contexts/AppDataContext";
import { useNavigate } from "react-router-dom";

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Clients() {
  const { clients, addClient } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", loanId: "", amount: "" });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter((c) => c.name.toLowerCase().includes(q) || c.loanId.toLowerCase().includes(q) || c.phone.includes(search));
  }, [clients, search]);

  const steps: WizardStep[] = [
    {
      id: "identity",
      label: "Identity",
      validate: () => Boolean(form.name.trim() && form.phone.trim()),
      content: (
        <div className="grid gap-3">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
          </div>
        </div>
      ),
    },
    {
      id: "financials",
      label: "Financials",
      validate: () => Boolean(form.loanId.trim()),
      content: (
        <div className="grid gap-3">
          <div>
            <Label>Loan ID</Label>
            <Input value={form.loanId} onChange={(e) => setForm((prev) => ({ ...prev, loanId: e.target.value }))} />
          </div>
          <div>
            <Label>Outstanding Amount</Label>
            <Input type="number" value={form.amount} onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))} />
          </div>
        </div>
      ),
    },
    {
      id: "review",
      label: "Review",
      content: (
        <div className="rounded-xl border border-border p-4 text-sm">
          <p><strong>Name:</strong> {form.name || "—"}</p>
          <p><strong>Phone:</strong> {form.phone || "—"}</p>
          <p><strong>Loan ID:</strong> {form.loanId || "—"}</p>
          <p><strong>Amount:</strong> {formatCurrency(parseFloat(form.amount) || 0)}</p>
        </div>
      ),
    },
  ];

  const handleComplete = async () => {
    await addClient({
      name: form.name,
      phone: form.phone,
      loanId: form.loanId,
      amount: parseFloat(form.amount) || 0,
    });
    setOpen(false);
    setForm({ name: "", phone: "", loanId: "", amount: "" });
  };

  return (
    <AppLayout title="Clients">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative max-w-sm animate-in-up w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, loan ID, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> New Borrower</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Add Borrower</DialogTitle></DialogHeader>
              <Wizard steps={steps} onComplete={handleComplete} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="animate-in-up rounded-xl border border-border bg-card shadow-sm" style={{ animationDelay: "100ms" }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Client</TableHead>
                <TableHead className="text-xs">Account #</TableHead>
                <TableHead className="text-xs">Phone</TableHead>
                <TableHead className="text-xs text-right">Total Due</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/clients/${c.id}`)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {c.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground">{c.phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs tabular-nums">{c.loanId}</TableCell>
                  <TableCell className="text-sm">{c.phone}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatCurrency(c.amount)}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
