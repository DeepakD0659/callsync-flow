export type ClientStatus = "PENDING" | "PROMISE_TO_PAY" | "PAID" | "UNREACHABLE" | "REFUSED" | "ESCALATED";
export type AssignmentStatus = "TO_CALL" | "CALLED" | "FOLLOW_UP" | "MISSED";
export type CallOutcome = "NO_ANSWER" | "WRONG_NUMBER" | "PROMISE_TO_PAY" | "REFUSAL" | "PAID" | "CALL_BACK_LATER";
export type UserRole = "ADMIN" | "AGENT";

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
}

export interface Client {
  id: string;
  loanAccountNumber: string;
  name: string;
  phone: string;
  email: string;
  totalDue: number;
  status: ClientStatus;
}

export interface Assignment {
  id: string;
  agentId: string;
  client: Client;
  assignedDate: string;
  status: AssignmentStatus;
  attemptCount: number;
  priority?: "HIGH" | "NORMAL";
  tag?: string;
}

export interface CallLog {
  id: string;
  assignmentId: string;
  timestamp: string;
  durationSeconds: number;
  notes: string;
  outcome: CallOutcome;
  promiseDate?: string;
  agentName: string;
}

export interface ImportBatch {
  id: string;
  adminName: string;
  uploadTimestamp: string;
  fileName: string;
  recordsProcessed: number;
  recordsFailed: number;
}

export const agents: Agent[] = [
  { id: "a1", name: "Priya Sharma", email: "priya@recovery.co", role: "AGENT", isActive: true },
  { id: "a2", name: "Rahul Mehta", email: "rahul@recovery.co", role: "AGENT", isActive: true },
  { id: "a3", name: "Anita Desai", email: "anita@recovery.co", role: "AGENT", isActive: true },
  { id: "a4", name: "Vikram Singh", email: "vikram@recovery.co", role: "AGENT", isActive: false },
  { id: "a5", name: "Neha Gupta", email: "neha@recovery.co", role: "AGENT", isActive: true },
];

export const clients: Client[] = [
  { id: "c1", loanAccountNumber: "LN-2024-00147", name: "Arun Patel", phone: "+91 98765 43210", email: "arun.p@gmail.com", totalDue: 145000, status: "PENDING" },
  { id: "c2", loanAccountNumber: "LN-2024-00293", name: "Meera Krishnan", phone: "+91 87654 32109", email: "meera.k@yahoo.com", totalDue: 82500, status: "PROMISE_TO_PAY" },
  { id: "c3", loanAccountNumber: "LN-2024-00418", name: "Suresh Reddy", phone: "+91 76543 21098", email: "suresh.r@outlook.com", totalDue: 230000, status: "UNREACHABLE" },
  { id: "c4", loanAccountNumber: "LN-2024-00562", name: "Fatima Begum", phone: "+91 65432 10987", email: "fatima.b@gmail.com", totalDue: 67800, status: "PENDING" },
  { id: "c5", loanAccountNumber: "LN-2024-00691", name: "Ravi Kumar", phone: "+91 54321 09876", email: "ravi.k@hotmail.com", totalDue: 312000, status: "REFUSED" },
  { id: "c6", loanAccountNumber: "LN-2024-00735", name: "Deepa Nair", phone: "+91 43210 98765", email: "deepa.n@gmail.com", totalDue: 95400, status: "PAID" },
  { id: "c7", loanAccountNumber: "LN-2024-00812", name: "Karthik Iyer", phone: "+91 32109 87654", email: "karthik.i@yahoo.com", totalDue: 178000, status: "PENDING" },
  { id: "c8", loanAccountNumber: "LN-2024-00956", name: "Lakshmi Devi", phone: "+91 21098 76543", email: "lakshmi.d@gmail.com", totalDue: 54200, status: "PROMISE_TO_PAY" },
];

export const todayAssignments: Assignment[] = [
  { id: "as1", agentId: "a1", client: clients[0], assignedDate: "2026-03-22", status: "TO_CALL", attemptCount: 0 },
  { id: "as2", agentId: "a1", client: clients[3], assignedDate: "2026-03-22", status: "TO_CALL", attemptCount: 2 },
  { id: "as3", agentId: "a1", client: clients[6], assignedDate: "2026-03-22", status: "CALLED", attemptCount: 1 },
  { id: "as4", agentId: "a1", client: clients[1], assignedDate: "2026-03-22", status: "FOLLOW_UP", attemptCount: 3, tag: "PROMISE" },
  { id: "as5", agentId: "a1", client: clients[4], assignedDate: "2026-03-22", status: "TO_CALL", attemptCount: 4, priority: "HIGH", tag: "ESCALATION RISK" },
  { id: "as6", agentId: "a2", client: clients[2], assignedDate: "2026-03-22", status: "TO_CALL", attemptCount: 0 },
  { id: "as7", agentId: "a2", client: clients[5], assignedDate: "2026-03-22", status: "CALLED", attemptCount: 1 },
  { id: "as8", agentId: "a2", client: clients[7], assignedDate: "2026-03-22", status: "TO_CALL", attemptCount: 0 },
];

export const callLogs: CallLog[] = [
  { id: "cl1", assignmentId: "as3", timestamp: "2026-03-22T09:15:00Z", durationSeconds: 245, notes: "Client acknowledged the outstanding amount. Requested 2 days to arrange payment.", outcome: "PROMISE_TO_PAY", promiseDate: "2026-03-24", agentName: "Priya Sharma" },
  { id: "cl2", assignmentId: "as4", timestamp: "2026-03-21T14:30:00Z", durationSeconds: 180, notes: "Follow-up call. Client confirmed bank transfer initiated.", outcome: "PROMISE_TO_PAY", promiseDate: "2026-03-23", agentName: "Priya Sharma" },
  { id: "cl3", assignmentId: "as7", timestamp: "2026-03-22T10:45:00Z", durationSeconds: 320, notes: "Payment confirmed by client. Reference number provided.", outcome: "PAID", agentName: "Rahul Mehta" },
];

export const importBatches: ImportBatch[] = [
  { id: "ib1", adminName: "Admin User", uploadTimestamp: "2026-03-20T08:00:00Z", fileName: "march_batch_1.xlsx", recordsProcessed: 156, recordsFailed: 3 },
  { id: "ib2", adminName: "Admin User", uploadTimestamp: "2026-03-18T09:30:00Z", fileName: "recovery_targets_mar18.xlsx", recordsProcessed: 89, recordsFailed: 0 },
  { id: "ib3", adminName: "Admin User", uploadTimestamp: "2026-03-15T11:00:00Z", fileName: "overdue_accounts_q1.csv", recordsProcessed: 312, recordsFailed: 7 },
];

export const dashboardMetrics = {
  totalCallsToday: 47,
  ptpVolume: 1285400,
  completionRate: 72,
  totalOutstanding: 3842600,
  agentPerformance: [
    { name: "Priya Sharma", calls: 12, completed: 8, avgDuration: 195, ptpAmount: 312000 },
    { name: "Rahul Mehta", calls: 10, completed: 9, avgDuration: 220, ptpAmount: 245000 },
    { name: "Anita Desai", calls: 11, completed: 7, avgDuration: 180, ptpAmount: 198000 },
    { name: "Neha Gupta", calls: 14, completed: 11, avgDuration: 165, ptpAmount: 530400 },
  ],
  weeklyTrend: [
    { day: "Mon", calls: 42, recovered: 380000 },
    { day: "Tue", calls: 38, recovered: 295000 },
    { day: "Wed", calls: 51, recovered: 445000 },
    { day: "Thu", calls: 45, recovered: 520000 },
    { day: "Fri", calls: 47, recovered: 410000 },
  ],
  statusBreakdown: [
    { status: "Pending", count: 124, color: "hsl(var(--primary))" },
    { status: "PTP", count: 45, color: "hsl(var(--warning))" },
    { status: "Paid", count: 67, color: "hsl(var(--success))" },
    { status: "Unreachable", count: 28, color: "hsl(var(--muted-foreground))" },
    { status: "Refused", count: 18, color: "hsl(var(--destructive))" },
  ],
};
