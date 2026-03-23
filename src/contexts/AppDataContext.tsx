import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Assignment,
  CallLog,
  CallOutcome,
  Client,
  NewCallLogInput,
  NewClientInput,
  UserRole,
} from "@/lib/domain";

declare global {
  interface Window {
    __initial_auth_token?: string;
  }
}

interface MockUser {
  uid: string;
  isAnonymous: boolean;
}

interface AppDataContextValue {
  loading: boolean;
  error: string | null;
  user: MockUser | null;
  role: UserRole;
  clients: Client[];
  assignments: Assignment[];
  setRole: (role: UserRole) => void;
  addClient: (input: NewClientInput) => Promise<void>;
  logCall: (input: NewCallLogInput) => Promise<void>;
  runImport: () => Promise<void>;
  subscribeToClientCalls: (clientId: string, cb: (logs: CallLog[]) => void) => () => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);
const nowMs = Date.now();

const seedClients: Client[] = [
  { id: "c1", name: "Arun Patel", phone: "+91 98765 43210", loanId: "LN-2026-001", amount: 145000, status: "PENDING", createdAtMs: nowMs - 1000000 },
  { id: "c2", name: "Meera Krishnan", phone: "+91 87654 32109", loanId: "LN-2026-002", amount: 82500, status: "PROMISE_TO_PAY", createdAtMs: nowMs - 900000 },
  { id: "c3", name: "Suresh Reddy", phone: "+91 76543 21098", loanId: "LN-2026-003", amount: 230000, status: "FOLLOW_UP", createdAtMs: nowMs - 800000 },
  { id: "c4", name: "Fatima Begum", phone: "+91 65432 10987", loanId: "LN-2026-004", amount: 67800, status: "PENDING", createdAtMs: nowMs - 700000 },
];

const seedAssignments: Assignment[] = [
  { id: "a1", clientId: "c1", agentId: "agent-1", agentName: "Priya Sharma", status: "TO_CALL", assignedDate: "2026-03-23" },
  { id: "a2", clientId: "c2", agentId: "agent-2", agentName: "Rahul Mehta", status: "FOLLOW_UP", assignedDate: "2026-03-23" },
  { id: "a3", clientId: "c3", agentId: "agent-1", agentName: "Priya Sharma", status: "TO_CALL", assignedDate: "2026-03-23" },
];

function mapOutcomeToClientStatus(outcome: CallOutcome) {
  switch (outcome) {
    case "PROMISE_TO_PAY":
      return "PROMISE_TO_PAY" as const;
    case "REFUSAL":
      return "REFUSED" as const;
    case "PAID":
      return "PAID" as const;
    case "CALL_BACK_LATER":
    case "FOLLOW_UP":
      return "FOLLOW_UP" as const;
    case "WRONG_NUMBER":
    case "NO_ANSWER":
    default:
      return "UNREACHABLE" as const;
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<MockUser | null>(null);
  const [role, setRole] = useState<UserRole>("ADMIN");
  const [clients, setClients] = useState<Client[]>(seedClients);
  const [assignments] = useState<Assignment[]>(seedAssignments);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const subscribersRef = useRef(new Map<string, Set<(logs: CallLog[]) => void>>());

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const token = window.__initial_auth_token;
      setUser({ uid: token ? "custom-token-user" : "anonymous-user", isAnonymous: !token });
      setLoading(false);
    }, 300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Mock realtime fanout for subscriber callbacks.
    for (const [clientId, callbacks] of subscribersRef.current.entries()) {
      const logs = callLogs
        .filter((entry) => entry.clientId === clientId)
        .sort((a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0));
      for (const cb of callbacks) cb(logs);
    }
  }, [callLogs]);

  const addClient = useCallback(
    async (input: NewClientInput) => {
      if (!user) return;
      const next: Client = {
        id: `c-${crypto.randomUUID()}`,
        name: input.name.trim(),
        phone: input.phone.trim(),
        loanId: input.loanId.trim(),
        amount: Number.isFinite(input.amount) ? input.amount : 0,
        status: "PENDING",
        createdAtMs: Date.now(),
      };
      setClients((prev) => [next, ...prev]);
    },
    [user],
  );

  const logCall = useCallback(
    async (input: NewCallLogInput) => {
      if (!user) return;
      const safeNotes = input.notes?.trim() ?? "";
      const entry: CallLog = {
        id: `log-${crypto.randomUUID()}`,
        clientId: input.clientId,
        outcome: input.outcome,
        notes: safeNotes,
        promiseDate: input.promiseDate || undefined,
        createdAtMs: Date.now(),
      };
      setCallLogs((prev) => [entry, ...prev]);
      setClients((prev) =>
        prev.map((client) =>
          client.id === input.clientId
            ? { ...client, status: mapOutcomeToClientStatus(input.outcome) }
            : client,
        ),
      );
    },
    [user],
  );

  const runImport = useCallback(async () => {
    if (!user) return;
    const mockRows: Array<Omit<NewClientInput, "amount"> & { amount: string }> = [
      { name: "Rahul Sharma", phone: "+91 9876543210", loanId: "LF-2026-441", amount: "120000" },
      { name: "Priya Singh", phone: "+91 9876500011", loanId: "LF-2026-442", amount: "84200" },
    ];
    const generated: Client[] = [];
    for (const row of mockRows) {
      generated.push({
        id: `c-${crypto.randomUUID()}`,
        name: row.name,
        phone: row.phone,
        loanId: row.loanId,
        amount: parseFloat(row.amount) || 0,
        status: "PENDING",
        createdAtMs: Date.now(),
      });
    }
    setClients((prev) => [...generated, ...prev]);
  }, [user]);

  const subscribeToClientCalls = useCallback(
    (clientId: string, cb: (logs: CallLog[]) => void) => {
      const set = subscribersRef.current.get(clientId) ?? new Set<(logs: CallLog[]) => void>();
      set.add(cb);
      subscribersRef.current.set(clientId, set);
      const logs = callLogs
        .filter((entry) => entry.clientId === clientId)
        .sort((a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0));
      cb(logs);
      return () => {
        const target = subscribersRef.current.get(clientId);
        if (!target) return;
        target.delete(cb);
        if (target.size === 0) subscribersRef.current.delete(clientId);
      };
    },
    [callLogs],
  );

  const value = useMemo<AppDataContextValue>(
    () => ({
      loading,
      error,
      user,
      role,
      clients,
      assignments,
      setRole,
      addClient,
      logCall,
      runImport,
      subscribeToClientCalls,
    }),
    [loading, error, user, role, clients, assignments, addClient, logCall, runImport, subscribeToClientCalls],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error("useAppData must be used inside AppDataProvider");
  return context;
}
