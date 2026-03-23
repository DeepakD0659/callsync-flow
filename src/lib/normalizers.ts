import type { DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import type { Assignment, AssignmentStatus, CallLog, CallOutcome, Client, ClientStatus } from "@/lib/domain";

function asTimestampMs(value: unknown): number | undefined {
  const maybe = value as Timestamp | Date | number | undefined;
  if (!maybe) return undefined;
  if (typeof maybe === "number") return Number.isFinite(maybe) ? maybe : undefined;
  if (maybe instanceof Date) return maybe.getTime();
  if (typeof (maybe as Timestamp).toMillis === "function") return (maybe as Timestamp).toMillis();
  return undefined;
}

function normalizeAmount(value: unknown): number {
  const parsed = typeof value === "number" ? value : parseFloat(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeClientStatus(value: unknown): ClientStatus {
  const allowed: ClientStatus[] = ["PENDING", "PROMISE_TO_PAY", "FOLLOW_UP", "PAID", "UNREACHABLE", "REFUSED"];
  return allowed.includes(value as ClientStatus) ? (value as ClientStatus) : "PENDING";
}

function normalizeAssignmentStatus(value: unknown): AssignmentStatus {
  const allowed: AssignmentStatus[] = ["TO_CALL", "CALLED", "FOLLOW_UP", "MISSED"];
  return allowed.includes(value as AssignmentStatus) ? (value as AssignmentStatus) : "TO_CALL";
}

function normalizeCallOutcome(value: unknown): CallOutcome {
  const allowed: CallOutcome[] = [
    "NO_ANSWER",
    "WRONG_NUMBER",
    "PROMISE_TO_PAY",
    "REFUSAL",
    "PAID",
    "CALL_BACK_LATER",
    "FOLLOW_UP",
  ];
  return allowed.includes(value as CallOutcome) ? (value as CallOutcome) : "NO_ANSWER";
}

export function docToClient(doc: QueryDocumentSnapshot<DocumentData>): Client {
  const data = doc.data();
  return {
    id: doc.id,
    name: String(data.name ?? ""),
    phone: String(data.phone ?? ""),
    loanId: String(data.loanId ?? data.loanAccountNumber ?? ""),
    amount: normalizeAmount(data.amount),
    status: normalizeClientStatus(data.status),
    createdAtMs: asTimestampMs(data.createdAt),
  };
}

export function docToAssignment(doc: QueryDocumentSnapshot<DocumentData>): Assignment {
  const data = doc.data();
  return {
    id: doc.id,
    clientId: String(data.clientId ?? ""),
    agentId: String(data.agentId ?? ""),
    agentName: data.agentName ? String(data.agentName) : undefined,
    status: normalizeAssignmentStatus(data.status),
    assignedDate: data.assignedDate ? String(data.assignedDate) : undefined,
  };
}

export function docToCallLog(doc: QueryDocumentSnapshot<DocumentData>): CallLog {
  const data = doc.data();
  return {
    id: doc.id,
    clientId: String(data.clientId ?? ""),
    outcome: normalizeCallOutcome(data.outcome),
    notes: String(data.notes ?? ""),
    promiseDate: data.promiseDate ? String(data.promiseDate) : undefined,
    createdAtMs: asTimestampMs(data.createdAt),
  };
}
