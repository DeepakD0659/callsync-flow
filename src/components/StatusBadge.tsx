import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-primary/10 text-primary" },
  PROMISE_TO_PAY: { label: "PTP", className: "bg-warning/10 text-warning" },
  PAID: { label: "Paid", className: "bg-success/10 text-success" },
  UNREACHABLE: { label: "Unreachable", className: "bg-muted text-muted-foreground" },
  REFUSED: { label: "Refused", className: "bg-destructive/10 text-destructive" },
  ESCALATED: { label: "Escalated", className: "bg-destructive/15 text-destructive font-semibold" },
  TO_CALL: { label: "To Call", className: "bg-primary/10 text-primary" },
  CALLED: { label: "Called", className: "bg-success/10 text-success" },
  FOLLOW_UP: { label: "Follow Up", className: "bg-warning/10 text-warning" },
  MISSED: { label: "Missed", className: "bg-destructive/10 text-destructive" },
  NO_ANSWER: { label: "No Answer", className: "bg-muted text-muted-foreground" },
  WRONG_NUMBER: { label: "Wrong Number", className: "bg-destructive/10 text-destructive" },
  REFUSAL: { label: "Refused", className: "bg-destructive/10 text-destructive" },
  CALL_BACK_LATER: { label: "Callback", className: "bg-warning/10 text-warning" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", config.className)}>
      {config.label}
    </span>
  );
}
