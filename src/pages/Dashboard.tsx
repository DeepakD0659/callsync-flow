import { AppLayout } from "@/components/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";
import { dashboardMetrics, callLogs, agents } from "@/lib/mock-data";
import { Phone, IndianRupee, TrendingUp, Banknote, ArrowUpRight, Activity, Download, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function formatCurrency(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const areaData = dashboardMetrics.weeklyTrend.map((d) => ({ ...d, target: 450000 }));

const activityLog = [
  { name: "Jonathan Davis", id: "LN-942-021-X", agent: "Sarah Jenkins", outcome: "PROMISE_TO_PAY", detail: "₹1,200 committed by 10/24", time: "2m ago" },
  { name: "Maria Lopez", id: "LN-112-884-A", agent: "Marcus Wu", outcome: "FOLLOW_UP", detail: "Requested callback after 5PM", time: "12m ago" },
  { name: "Thomas Kovic", id: "LN-552-092-B", agent: "Elena Rodriguez", outcome: "NO_ANSWER", detail: "3rd attempt failed. Queue for escalation.", time: "18m ago" },
];

export default function Dashboard() {
  const m = dashboardMetrics;
  return (
    <AppLayout title="Recovery Overview">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground animate-in-up">Real-time performance metrics for the active collection cycle.</p>
          <Tabs defaultValue="daily" className="animate-in-up">
            <TabsList className="h-8">
              <TabsTrigger value="daily" className="text-xs px-3 h-6">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs px-3 h-6">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs px-3 h-6">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total Active Clients" value="1,482" change="+12%" changeType="positive" icon={Phone} delay={0} />
          <MetricCard title="Calls Made Today" value={`${m.totalCallsToday}`} change={`/ 500 target`} changeType="neutral" icon={Activity} delay={60} />
          <MetricCard title="Payment Commitments" value={formatCurrency(m.ptpVolume)} change="High" changeType="positive" icon={IndianRupee} delay={120} />
          <MetricCard title="Overdue Follow-ups" value="28" change="Critical" changeType="negative" icon={Banknote} delay={180} />
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="animate-in-up lg:col-span-2 border-border shadow-sm" style={{ animationDelay: "240ms" }}>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Recovery Trend Analysis</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary">
                Full Report <ArrowUpRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="recoveredGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v / 1000}K`} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Recovered"]} />
                    <Area type="monotone" dataKey="recovered" stroke="hsl(var(--primary))" fill="url(#recoveredGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Agent Leaderboard */}
          <Card className="animate-in-up border-border shadow-sm" style={{ animationDelay: "320ms" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Agent Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {m.agentPerformance.sort((a, b) => b.ptpAmount - a.ptpAmount).slice(0, 3).map((ap, i) => (
                <div key={ap.name} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/30">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{ap.name}</p>
                    <p className="text-[11px] text-muted-foreground">{Math.round((ap.completed / ap.calls) * 100)}% Commitment Rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums text-success">{formatCurrency(ap.ptpAmount)}</p>
                    <p className="text-[10px] text-muted-foreground">Recovery</p>
                  </div>
                </div>
              ))}
              <a href="/performance" className="flex items-center justify-center gap-1 text-xs font-medium text-primary hover:underline pt-1">
                View Full Team Performance
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Activity Log */}
        <Card className="animate-in-up border-border shadow-sm" style={{ animationDelay: "400ms" }}>
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">Live Activity Log</CardTitle>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Updating</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7"><Filter className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Client / Loan ID</TableHead>
                  <TableHead className="text-xs">Agent</TableHead>
                  <TableHead className="text-xs">Outcome</TableHead>
                  <TableHead className="text-xs">Details</TableHead>
                  <TableHead className="text-xs text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLog.map((entry, i) => (
                  <TableRow key={i} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                          {entry.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{entry.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">{entry.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{entry.agent}</TableCell>
                    <TableCell><StatusBadge status={entry.outcome} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{entry.detail}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{entry.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
