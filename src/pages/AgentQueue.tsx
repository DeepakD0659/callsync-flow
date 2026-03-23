import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Phone, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "@/contexts/AppDataContext";
import { summarizeClients } from "@/lib/selectors";

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function QueueSummary({ pending, followUp }: { pending: number; followUp: number }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="animate-in-up rounded-xl border border-border bg-card p-4 text-center shadow-sm">
        <p className="text-2xl font-bold tabular-nums text-primary">{pending + followUp}</p>
        <p className="text-[11px] text-muted-foreground mt-1 font-medium">To Call</p>
      </div>
      <div className="animate-in-up rounded-xl border border-border bg-card p-4 text-center shadow-sm" style={{ animationDelay: "60ms" }}>
        <p className="text-2xl font-bold tabular-nums text-success">{pending}</p>
        <p className="text-[11px] text-muted-foreground mt-1 font-medium">Called</p>
      </div>
      <div className="animate-in-up rounded-xl border border-border bg-card p-4 text-center shadow-sm" style={{ animationDelay: "120ms" }}>
        <p className="text-2xl font-bold tabular-nums text-warning">{followUp}</p>
        <p className="text-[11px] text-muted-foreground mt-1 font-medium">Follow Up</p>
      </div>
    </div>
  );
}

export default function AgentQueue() {
  const { clients } = useAppData();
  const navigate = useNavigate();
  const summary = useMemo(() => summarizeClients(clients), [clients]);
  const pending = summary.statusCounts.PENDING ?? 0;
  const followUp = summary.statusCounts.FOLLOW_UP ?? 0;

  return (
    <AppLayout title="Recovery Manager">
      <div className="space-y-6">
        <QueueSummary pending={pending} followUp={followUp} />
        <div className="space-y-3">
          {summary.queueClients.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Queue Exhausted - All daily targets have been processed.
              </CardContent>
            </Card>
          )}
          {summary.queueClients.map((client) => (
            <Card key={client.id} className="border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                  {client.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{client.name}</p>
                  <p className="text-xs text-muted-foreground">{client.loanId} · {client.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(client.amount)}</p>
                  <StatusBadge status={client.status} />
                </div>
                <Button size="sm" className="gap-2" onClick={() => navigate(`/clients/${client.id}`)}>
                  <Phone className="h-4 w-4" /> Execute Call <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
