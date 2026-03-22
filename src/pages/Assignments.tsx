import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { todayAssignments, agents } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Assignments() {
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
            {todayAssignments.map((a) => {
              const agent = agents.find((ag) => ag.id === a.agentId);
              return (
                <TableRow key={a.id}>
                  <TableCell>
                    <p className="text-sm font-medium">{a.client.name}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{a.client.loanAccountNumber}</p>
                  </TableCell>
                  <TableCell className="text-sm">{agent?.name || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.assignedDate}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatCurrency(a.client.totalDue)}</TableCell>
                  <TableCell className="text-right tabular-nums">{a.attemptCount}</TableCell>
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
