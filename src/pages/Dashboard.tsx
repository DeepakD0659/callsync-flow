import { AppLayout } from "@/components/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";
import { dashboardMetrics, agents } from "@/lib/mock-data";
import { Phone, IndianRupee, TrendingUp, Banknote, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

function formatCurrency(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Dashboard() {
  const m = dashboardMetrics;
  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Calls Today" value={m.totalCallsToday.toString()} change="+12% vs yesterday" changeType="positive" icon={Phone} delay={0} />
          <MetricCard title="PTP Volume" value={formatCurrency(m.ptpVolume)} change="+₹1.2L this week" changeType="positive" icon={IndianRupee} delay={80} />
          <MetricCard title="Completion Rate" value={`${m.completionRate}%`} change="+4pp vs last week" changeType="positive" icon={TrendingUp} delay={160} />
          <MetricCard title="Outstanding" value={formatCurrency(m.totalOutstanding)} change="282 active accounts" changeType="neutral" icon={Banknote} delay={240} />
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="animate-in-up lg:col-span-2 border-border shadow-sm" style={{ animationDelay: "320ms" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Weekly Recovery Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={m.weeklyTrend} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v / 1000}K`} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                      formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Recovered"]}
                    />
                    <Bar dataKey="recovered" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in-up border-border shadow-sm" style={{ animationDelay: "400ms" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Client Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={m.statusBreakdown} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                      {m.statusBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {m.statusBreakdown.map((s) => (
                  <div key={s.status} className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-muted-foreground">{s.status}</span>
                    <span className="ml-auto font-medium tabular-nums">{s.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Performance Table */}
        <Card className="animate-in-up border-border shadow-sm" style={{ animationDelay: "480ms" }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Agent Performance Today</CardTitle>
              <a href="/performance" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                View all <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Agent</TableHead>
                  <TableHead className="text-xs text-right">Calls</TableHead>
                  <TableHead className="text-xs text-right">Completed</TableHead>
                  <TableHead className="text-xs">Progress</TableHead>
                  <TableHead className="text-xs text-right">Avg Duration</TableHead>
                  <TableHead className="text-xs text-right">PTP Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {m.agentPerformance.map((ap) => (
                  <TableRow key={ap.name}>
                    <TableCell className="font-medium text-sm">{ap.name}</TableCell>
                    <TableCell className="text-right tabular-nums">{ap.calls}</TableCell>
                    <TableCell className="text-right tabular-nums">{ap.completed}/{ap.calls}</TableCell>
                    <TableCell>
                      <Progress value={(ap.completed / ap.calls) * 100} className="h-1.5 w-20" />
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-mono text-xs">{Math.floor(ap.avgDuration / 60)}m {ap.avgDuration % 60}s</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">{formatCurrency(ap.ptpAmount)}</TableCell>
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
