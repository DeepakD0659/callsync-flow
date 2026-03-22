import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
  delay?: number;
}

export function MetricCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor, className, delay = 0 }: MetricCardProps) {
  return (
    <div
      className={cn(
        "animate-in-up rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
          {change && (
            <p className={cn(
              "text-xs font-medium",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5", iconColor || "bg-primary/10")}>
          <Icon className={cn("h-5 w-5", iconColor ? "text-card" : "text-primary")} />
        </div>
      </div>
    </div>
  );
}
