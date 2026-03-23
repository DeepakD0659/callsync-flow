import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppData } from "@/contexts/AppDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wizard, type WizardStep } from "@/components/Wizard";
import type { CallOutcome } from "@/lib/domain";

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

const outcomes: CallOutcome[] = ["PROMISE_TO_PAY", "NO_ANSWER", "REFUSAL", "PAID", "CALL_BACK_LATER"];

export default function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { clients, subscribeToClientCalls, logCall } = useAppData();
  const client = useMemo(() => clients.find((entry) => entry.id === clientId), [clients, clientId]);
  const [callLogs, setCallLogs] = useState<Array<{ id: string; notes: string; outcome: string; promiseDate?: string }>>([]);
  const [form, setForm] = useState({ outcome: "NO_ANSWER" as CallOutcome, notes: "", promiseDate: "" });

  useEffect(() => {
    if (!clientId) return;
    const unsub = subscribeToClientCalls(clientId, (logs) => setCallLogs(logs));
    return () => unsub();
  }, [clientId, subscribeToClientCalls]);

  if (!client) {
    return (
      <AppLayout title="Client Detail">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">Client not found.</p>
            <Button className="mt-3" onClick={() => navigate("/queue")}>Back to Queue</Button>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  const steps: WizardStep[] = [
    {
      id: "resolution",
      label: "Resolution",
      content: (
        <div className="grid gap-2 sm:grid-cols-2">
          {outcomes.map((outcome) => (
            <button
              key={outcome}
              onClick={() => setForm((prev) => ({ ...prev, outcome }))}
              className={`rounded-xl border p-3 text-left text-sm ${form.outcome === outcome ? "border-primary bg-primary/5" : "border-border"}`}
            >
              {outcome}
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "documentation",
      label: "Documentation",
      content: (
        <div className="grid gap-3">
          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
          </div>
          {form.outcome === "PROMISE_TO_PAY" && (
            <div>
              <Label>Promise Date</Label>
              <Input type="date" value={form.promiseDate} onChange={(e) => setForm((prev) => ({ ...prev, promiseDate: e.target.value }))} />
            </div>
          )}
        </div>
      ),
    },
    {
      id: "audio",
      label: "Audio Evidence",
      content: (
        <div className="rounded-xl border-2 border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Upload placeholder for call recording evidence.
        </div>
      ),
    },
  ];

  return (
    <AppLayout title="Client Detail">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{client.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Loan ID</p>
              <p className="text-sm font-medium">{client.loanId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Exposure</p>
              <p className="text-sm font-medium">{formatCurrency(client.amount)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <StatusBadge status={client.status} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Log Interaction</CardTitle></CardHeader>
          <CardContent>
            <Wizard
              steps={steps}
              onComplete={async () => {
                await logCall({
                  clientId: client.id,
                  outcome: form.outcome,
                  notes: form.notes || "",
                  promiseDate: form.outcome === "PROMISE_TO_PAY" ? form.promiseDate : undefined,
                });
                setForm({ outcome: "NO_ANSWER", notes: "", promiseDate: "" });
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Audit Trail</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {callLogs.length === 0 && (
              <p className="text-sm text-muted-foreground">Clean Slate - No interactions recorded yet.</p>
            )}
            {callLogs.map((log) => (
              <div key={log.id} className="rounded-xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <StatusBadge status={log.outcome} />
                  {log.promiseDate && <span className="text-xs text-warning">Promise date: {log.promiseDate}</span>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{log.notes || "No comments recorded."}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
