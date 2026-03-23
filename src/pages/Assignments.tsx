import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppData } from "@/contexts/AppDataContext";
import { useMemo } from "react";

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Assignments() {
  const { assignments, clients } = useAppData();
  const clientById = useMemo(() => {
    const map: Record<string, (typeof clients)[number]> = {};
    for (const client of clients) map[client.id] = client;
    return map;
  }, [clients]);

  return (
    <AppLayout title="Assignments">
      <div className="animate-in-up rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Client</TableHead>
              <TableHead className="text-xs">Agent</TableHead>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs text-right">Due</TableHead>
              <TableHead className="text-xs text-right">Attempts</TableHead>
              <TableHead className="text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">
                  No active dispatches.
                </TableCell>
              </TableRow>
            )}
            {assignments.map((a) => {
              const client = clientById[a.clientId];
              return (
                <TableRow key={a.id}>
                  <TableCell>
                    <p className="text-sm font-medium">{client?.name || "Unknown"}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{client?.loanId || "—"}</p>
                  </TableCell>
                  <TableCell className="text-sm">{a.agentName || a.agentId || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.assignedDate || "—"}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatCurrency(client?.amount || 0)}</TableCell>
                  <TableCell className="text-right tabular-nums">—</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
