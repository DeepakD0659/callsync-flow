import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { clients } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Clients() {
  const [search, setSearch] = useState("");
  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.loanAccountNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <AppLayout title="Clients">
      <div className="space-y-4">
        <div className="relative max-w-sm animate-in-up">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, account, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
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
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {c.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs tabular-nums">{c.loanAccountNumber}</TableCell>
                  <TableCell className="text-sm">{c.phone}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatCurrency(c.totalDue)}</TableCell>
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
