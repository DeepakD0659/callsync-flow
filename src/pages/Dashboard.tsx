import { AppLayout } from "@/components/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { useMemo } from "react";
import { Activity, IndianRupee, Phone } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/contexts/AppDataContext";
import { safePieStatusData, summarizeClients } from "@/lib/selectors";

function formatCurrency(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Dashboard() {
  const { clients, loading } = useAppData();
  const summary = useMemo(() => summarizeClients(clients), [clients]);
  const pieData = useMemo(() => safePieStatusData(summary.statusCounts), [summary.statusCounts]);
  const colors = ["hsl(var(--primary))", "hsl(var(--warning))", "hsl(var(--accent))", "hsl(var(--destructive))", "hsl(var(--success))"];

  return (
    <AppLayout title="Recovery Overview">
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground animate-in-up">Real-time performance metrics for the active collection cycle.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total Borrowers" value={`${summary.totalBorrowers}`} change={loading ? "Syncing..." : "Live"} changeType="neutral" icon={Phone} delay={0} />
          <MetricCard title="Total Exposure" value={formatCurrency(summary.totalExposure)} change="Portfolio" changeType="neutral" icon={IndianRupee} delay={60} />
          <MetricCard title="Active PTPs" value={`${summary.activePtps}`} change="Promise to pay" changeType="positive" icon={Activity} delay={120} />
          <MetricCard title="Queue Accounts" value={`${summary.queueClients.length}`} change="Needs action" changeType="negative" icon={Phone} delay={180} />
        </div>

        <Card className="animate-in-up border-border shadow-sm" style={{ animationDelay: "240ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
