import { AuditLogEntry, AuditAction, ACTION_SEVERITY_MAP } from "@/types/audit-log";

const AUDIT_STORAGE_KEY = "thitronik_audit_logs";
const MAX_AUDIT_ENTRIES = 500;

/**
 * Creates a new audit log entry with auto-generated ID and timestamp.
 */
export function createAuditEntry(params: {
  actor_id: string;
  actor_name: string;
  action: AuditAction;
  target_id?: string;
  target_label?: string;
  details?: Record<string, unknown>;
}): AuditLogEntry {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    severity: ACTION_SEVERITY_MAP[params.action],
    ...params,
  };
}

/**
 * Retrieves stored audit logs from localStorage.
 */
export function getStoredAuditLogs(): AuditLogEntry[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed as AuditLogEntry[];
    }
  } catch (error) {
    console.error("Failed to parse audit logs from localStorage:", error);
  }
  
  return [];
}

/**
 * Saves a new audit log entry to localStorage (prepends).
 * Limits the total number of entries to MAX_AUDIT_ENTRIES.
 */
export function storeAuditLog(entry: AuditLogEntry): void {
  if (typeof window === "undefined") return;
  
  try {
    const currentLogs = getStoredAuditLogs();
    const updatedLogs = [entry, ...currentLogs].slice(0, MAX_AUDIT_ENTRIES);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (error) {
    console.error("Failed to store audit log in localStorage:", error);
  }
}

/**
 * Clears all audit logs from localStorage.
 */
export function clearAuditLogs(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUDIT_STORAGE_KEY);
}
