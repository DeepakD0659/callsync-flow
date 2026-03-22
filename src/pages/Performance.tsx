import { AppLayout } from "@/components/AppLayout";
import { dashboardMetrics } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

function formatCurrency(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${(n / 1000).toFixed(1)}K`;
}

export default function Performance() {
  const perf = dashboardMetrics.agentPerformance;
  const chartData = perf.map((p) => ({ name: p.name.split(" ")[0], calls: p.calls, completed: p.completed }));

  return (
    <AppLayout title="Agent Performance">
      <div className="space-y-6">
        <Card className="animate-in-up border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calls vs Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                  <Bar dataKey="calls" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} maxBarSize={32} name="Total Calls" />
                  <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={32} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-in-up border-border shadow-sm" style={{ animationDelay: "120ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Detailed Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Agent</TableHead>
                  <TableHead className="text-xs text-right">Calls</TableHead>
                  <TableHead className="text-xs text-right">Completed</TableHead>
                  <TableHead className="text-xs">Rate</TableHead>
                  <TableHead className="text-xs text-right">Avg Duration</TableHead>
                  <TableHead className="text-xs text-right">PTP Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {perf.map((ap) => (
                  <TableRow key={ap.name}>
                    <TableCell className="font-medium">{ap.name}</TableCell>
                    <TableCell className="text-right tabular-nums">{ap.calls}</TableCell>
                    <TableCell className="text-right tabular-nums">{ap.completed}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={(ap.completed / ap.calls) * 100} className="h-1.5 w-16" />
                        <span className="text-xs tabular-nums text-muted-foreground">{Math.round((ap.completed / ap.calls) * 100)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">{Math.floor(ap.avgDuration / 60)}m {ap.avgDuration % 60}s</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{formatCurrency(ap.ptpAmount)}</TableCell>
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
