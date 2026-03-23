export type UserRole = "ADMIN" | "AGENT";

export type ClientStatus =
  | "PENDING"
  | "PROMISE_TO_PAY"
  | "FOLLOW_UP"
  | "PAID"
  | "UNREACHABLE"
  | "REFUSED";

export type AssignmentStatus = "TO_CALL" | "CALLED" | "FOLLOW_UP" | "MISSED";

export type CallOutcome =
  | "NO_ANSWER"
  | "WRONG_NUMBER"
  | "PROMISE_TO_PAY"
  | "REFUSAL"
  | "PAID"
  | "CALL_BACK_LATER"
  | "FOLLOW_UP";

export interface Client {
  id: string;
  name: string;
  phone: string;
  loanId: string;
  amount: number;
  status: ClientStatus;
  createdAtMs?: number;
}

export interface Assignment {
  id: string;
  clientId: string;
  agentId: string;
  agentName?: string;
  status: AssignmentStatus;
  assignedDate?: string;
}

export interface CallLog {
  id: string;
  clientId: string;
  outcome: CallOutcome;
  notes: string;
  promiseDate?: string;
  createdAtMs?: number;
}

export interface NewClientInput {
  name: string;
  phone: string;
  loanId: string;
  amount: number;
}

export interface NewCallLogInput {
  clientId: string;
  outcome: CallOutcome;
  notes?: string;
  promiseDate?: string;
}
