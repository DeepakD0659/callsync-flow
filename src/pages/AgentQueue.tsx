import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { todayAssignments, callLogs, type Assignment } from "@/lib/mock-data";
import { Phone, Clock, Upload, ChevronRight, AlertTriangle, PhoneOff, Pause, Mic, FileText, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const agentAssignments = todayAssignments.filter((a) => a.agentId === "a1");

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function QueueSummary() {
  const toCalls = agentAssignments.filter((a) => a.status === "TO_CALL").length;
  const called = agentAssignments.filter((a) => a.status === "CALLED").length;
  const followUp = agentAssignments.filter((a) => a.status === "FOLLOW_UP").length;
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="animate-in-up rounded-xl border border-border bg-card p-4 text-center shadow-sm">
        <p className="text-2xl font-bold tabular-nums text-primary">{toCalls}</p>
        <p className="text-[11px] text-muted-foreground mt-1 font-medium">To Call</p>
      </div>
      <div className="animate-in-up rounded-xl border border-border bg-card p-4 text-center shadow-sm" style={{ animationDelay: "60ms" }}>
        <p className="text-2xl font-bold tabular-nums text-success">{called}</p>
        <p className="text-[11px] text-muted-foreground mt-1 font-medium">Called</p>
      </div>
      <div className="animate-in-up rounded-xl border border-border bg-card p-4 text-center shadow-sm" style={{ animationDelay: "120ms" }}>
        <p className="text-2xl font-bold tabular-nums text-warning">{followUp}</p>
        <p className="text-[11px] text-muted-foreground mt-1 font-medium">Follow Up</p>
      </div>
    </div>
  );
}

function QueueList({ selected, onSelect }: { selected: Assignment | null; onSelect: (a: Assignment) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Daily Queue</h3>
        <span className="text-[10px] text-destructive font-semibold uppercase tracking-wider">Priority High</span>
      </div>
      {agentAssignments.map((assignment, i) => (
        <Card
          key={assignment.id}
          className={cn(
            "animate-in-up cursor-pointer border-border shadow-sm transition-all hover:shadow-md active:scale-[0.995]",
            assignment.priority === "HIGH" && "border-l-2 border-l-destructive",
            selected?.id === assignment.id && "ring-2 ring-primary shadow-md"
          )}
          style={{ animationDelay: `${180 + i * 60}ms` }}
          onClick={() => onSelect(assignment)}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-muted to-muted/50 text-sm font-bold">
              {assignment.client.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold truncate">{assignment.client.name}</p>
                {assignment.tag && (
                  <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
                    <AlertTriangle className="h-2.5 w-2.5" />
                    {assignment.tag}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{assignment.client.loanAccountNumber} · {assignment.client.phone}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold tabular-nums">{formatCurrency(assignment.client.totalDue)}</p>
              <StatusBadge status={assignment.status} />
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ActiveCallSession({ assignment }: { assignment: Assignment }) {
  const logs = callLogs.filter((cl) => cl.assignmentId === assignment.id);
  return (
    <Card className="animate-in-up border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Working Account</p>
            <CardTitle className="text-base">{assignment.client.name} <span className="text-muted-foreground font-normal text-xs">(ID: {assignment.client.loanAccountNumber})</span></CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" className="gap-1.5">
              <PhoneOff className="h-3.5 w-3.5" /> Terminate
            </Button>
            <Button size="sm" className="gap-1.5">
              Submit & Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dossier" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-9 mb-4">
            <TabsTrigger value="dossier" className="text-xs gap-1.5"><FileText className="h-3.5 w-3.5" /> Dossier</TabsTrigger>
            <TabsTrigger value="logger" className="text-xs gap-1.5"><Mic className="h-3.5 w-3.5" /> Logger</TabsTrigger>
            <TabsTrigger value="outcome" className="text-xs gap-1.5"><History className="h-3.5 w-3.5" /> History</TabsTrigger>
          </TabsList>

          <TabsContent value="dossier" className="space-y-4 animate-in-up">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground">Principal Balance</p>
                <p className="text-xl font-bold tabular-nums mt-1">{formatCurrency(assignment.client.totalDue)}</p>
                <StatusBadge status={assignment.client.status} />
              </div>
              <div className="rounded-xl border border-border p-4 space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                  <p className="text-sm font-semibold text-destructive">122 Days</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Interest</p>
                  <p className="text-sm font-semibold">14.2% APR</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{assignment.client.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{assignment.client.email}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logger" className="space-y-4 animate-in-up">
            {/* Recording indicator */}
            <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3">
              <div className="relative h-3 w-3">
                <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-75" />
                <span className="relative block h-3 w-3 rounded-full bg-destructive" />
              </div>
              <span className="text-xs font-semibold text-destructive">Live Recording</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto"><Pause className="h-3 w-3" /></Button>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-bold tabular-nums font-mono">04:12</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Live Call Notes</p>
              <Textarea placeholder="Enter call notes here..." className="min-h-[100px]" />
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Voice Recording</p>
              <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border p-6 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="text-center">
                  <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">Drop or select manual recordings</p>
                  <p className="text-[10px] text-muted-foreground">.mp3, .wav, .m4a — max 25MB</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Call Outcome</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Paid / Settlement", color: "success" },
                  { label: "Promise to Pay", color: "warning" },
                  { label: "Refused to Pay", color: "destructive" },
                  { label: "Wrong Number", color: "muted-foreground" },
                ].map((o) => (
                  <button key={o.label} className="rounded-xl border border-border p-3 text-left text-xs font-medium transition-all hover:border-primary/40 hover:bg-primary/5">
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="outcome" className="space-y-3 animate-in-up">
            {logs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No previous call history for this assignment.</p>
            )}
            {logs.map((cl) => (
              <div key={cl.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default function AgentQueue() {
  const [selected, setSelected] = useState<Assignment | null>(null);

  return (
    <AppLayout title="Recovery Manager">
      <div className="space-y-6">
        <QueueSummary />

        <div className={cn("grid gap-6", selected ? "lg:grid-cols-5" : "")}>
          <div className={cn(selected ? "lg:col-span-2" : "")}>
            <QueueList selected={selected} onSelect={setSelected} />
          </div>
          {selected && (
            <div className="lg:col-span-3">
              <ActiveCallSession assignment={selected} />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
