import type { Assignment, Client } from "@/lib/domain";

export interface ClientSummary {
  totalExposure: number;
  totalBorrowers: number;
  activePtps: number;
  statusCounts: Record<string, number>;
  queueClients: Client[];
}

export function summarizeClients(clients: Client[]): ClientSummary {
  let totalExposure = 0;
  let activePtps = 0;
  const statusCounts: Record<string, number> = {};
  const queueClients: Client[] = [];

  for (const client of clients) {
    totalExposure += Number.isFinite(client.amount) ? client.amount : 0;
    statusCounts[client.status] = (statusCounts[client.status] ?? 0) + 1;
    if (client.status === "PROMISE_TO_PAY") activePtps += 1;
    if (client.status === "PENDING" || client.status === "FOLLOW_UP") queueClients.push(client);
  }

  return {
    totalExposure,
    totalBorrowers: clients.length,
    activePtps,
    statusCounts,
    queueClients,
  };
}

export interface AssignmentSummary {
  byClientId: Record<string, Assignment>;
  total: number;
}

export function summarizeAssignments(assignments: Assignment[]): AssignmentSummary {
  const byClientId: Record<string, Assignment> = {};
  for (const assignment of assignments) {
    byClientId[assignment.clientId] = assignment;
  }
  return { byClientId, total: assignments.length };
}

export function safePieStatusData(statusCounts: Record<string, number>) {
  const mapping: Array<{ key: string; name: string }> = [
    { key: "PENDING", name: "Pending" },
    { key: "PROMISE_TO_PAY", name: "PTP" },
    { key: "FOLLOW_UP", name: "Follow Up" },
    { key: "REFUSED", name: "Refused" },
    { key: "PAID", name: "Paid" },
  ];

  const raw = mapping.map((item) => ({
    name: item.name,
    value: statusCounts[item.key] ?? 0,
  }));

  const hasAnyNonZero = raw.some((item) => item.value > 0);
  if (hasAnyNonZero) return raw;
  return raw.map((item, index) => (index === 0 ? { ...item, value: 1 } : item));
}
