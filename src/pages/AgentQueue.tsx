import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { todayAssignments, callLogs, type Assignment, type CallOutcome } from "@/lib/mock-data";
import { Phone, Clock, FileText, Upload, ChevronRight, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const agentAssignments = todayAssignments.filter((a) => a.agentId === "a1");

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function AgentQueue() {
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [logOpen, setLogOpen] = useState(false);

  const toCalls = agentAssignments.filter((a) => a.status === "TO_CALL").length;
  const called = agentAssignments.filter((a) => a.status === "CALLED").length;
  const followUp = agentAssignments.filter((a) => a.status === "FOLLOW_UP").length;

  return (
    <AppLayout title="My Daily Queue">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="animate-in-up rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-2xl font-semibold tabular-nums text-primary">{toCalls}</p>
            <p className="text-xs text-muted-foreground mt-1">To Call</p>
          </div>
          <div className="animate-in-up rounded-lg border border-border bg-card p-4 text-center" style={{ animationDelay: "80ms" }}>
            <p className="text-2xl font-semibold tabular-nums text-success">{called}</p>
            <p className="text-xs text-muted-foreground mt-1">Called</p>
          </div>
          <div className="animate-in-up rounded-lg border border-border bg-card p-4 text-center" style={{ animationDelay: "160ms" }}>
            <p className="text-2xl font-semibold tabular-nums text-warning">{followUp}</p>
            <p className="text-xs text-muted-foreground mt-1">Follow Up</p>
          </div>
        </div>

        {/* Queue */}
        <div className="space-y-2">
          {agentAssignments.map((assignment, i) => (
            <Card
              key={assignment.id}
              className={cn(
                "animate-in-up cursor-pointer border-border shadow-sm transition-all hover:shadow-md active:scale-[0.99]",
                assignment.priority === "HIGH" && "border-l-2 border-l-destructive",
                selected?.id === assignment.id && "ring-2 ring-primary"
              )}
              style={{ animationDelay: `${200 + i * 80}ms` }}
              onClick={() => setSelected(assignment)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {assignment.client.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{assignment.client.name}</p>
                    {assignment.tag && (
                      <span className="flex items-center gap-1 rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        {assignment.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{assignment.client.loanAccountNumber} · {assignment.client.phone}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold tabular-nums">{formatCurrency(assignment.client.totalDue)}</p>
                  <StatusBadge status={assignment.status} />
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Client Detail */}
        {selected && (
          <Card className="animate-in-up border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{selected.client.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{selected.client.loanAccountNumber} · Attempt #{selected.attemptCount + 1}</p>
                </div>
                <Button onClick={() => setLogOpen(true)} className="gap-2">
                  <Phone className="h-4 w-4" />
                  Log Call
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="font-medium">{selected.client.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium">{selected.client.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Total Due</p>
                  <p className="font-semibold text-lg tabular-nums">{formatCurrency(selected.client.totalDue)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <StatusBadge status={selected.client.status} />
                </div>
              </div>

              {/* Past call logs for this assignment */}
              {callLogs.filter((cl) => cl.assignmentId === selected.id).length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Call History</p>
                  {callLogs.filter((cl) => cl.assignmentId === selected.id).map((cl) => (
                    <div key={cl.id} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={cl.outcome} />
                          <span className="text-[11px] text-muted-foreground font-mono tabular-nums">
                            {Math.floor(cl.durationSeconds / 60)}m {cl.durationSeconds % 60}s
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{cl.notes}</p>
                        {cl.promiseDate && (
                          <p className="text-xs font-medium text-warning mt-1">Promise date: {cl.promiseDate}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Log Call Dialog */}
        <Dialog open={logOpen} onOpenChange={setLogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Log Call — {selected?.client.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Duration (seconds)</Label>
                  <Input type="number" placeholder="180" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Outcome</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NO_ANSWER">No Answer</SelectItem>
                      <SelectItem value="PROMISE_TO_PAY">Promise to Pay</SelectItem>
                      <SelectItem value="REFUSAL">Refusal</SelectItem>
                      <SelectItem value="WRONG_NUMBER">Wrong Number</SelectItem>
                      <SelectItem value="CALL_BACK_LATER">Call Back Later</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Promise Date (if PTP)</Label>
                <Input type="date" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Notes</Label>
                <Textarea placeholder="Call notes..." className="mt-1 min-h-[80px]" />
              </div>
              <div>
                <Label className="text-xs">Voice Recording</Label>
                <div className="mt-1 flex items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50">
                  <div className="text-center">
                    <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                    <p className="mt-1 text-xs text-muted-foreground">Drop audio file or click to browse</p>
                    <p className="text-[10px] text-muted-foreground">.mp3, .wav, .m4a — max 25MB</p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLogOpen(false)}>Cancel</Button>
              <Button onClick={() => setLogOpen(false)}>Submit Log</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
