// Typdefinitionen für das Audit Log System

export type AuditAction =
  | "user.role_changed"
  | "user.deleted"
  | "user.created"
  | "event.code_generated"
  | "settings.changed"
  | "user.login"
  | "user.logout";

export type AuditSeverity = "info" | "warning" | "critical";

export interface AuditLogEntry {
  id: string;           // UUID v4
  timestamp: string;    // ISO 8601
  actor_id: string;     // User-ID des Ausführenden
  actor_name: string;   // Anzeigename des Ausführenden
  action: AuditAction;  // Aktionstyp
  severity: AuditSeverity;
  target_id?: string;   // Betroffene Entität (User-ID, Event-Code etc.)
  target_label?: string; // Menschenlesbarer Name des Ziels
  details?: Record<string, unknown>; // Zusatzinfos (z.B. { from: "user", to: "admin" })
}

// Mapping: Aktion → Severity
export const ACTION_SEVERITY_MAP: Record<AuditAction, AuditSeverity> = {
  "user.role_changed": "warning",
  "user.deleted": "critical",
  "user.created": "info",
  "event.code_generated": "info",
  "settings.changed": "warning",
  "user.login": "info",
  "user.logout": "info",
};

// Mapping: Aktion → Deutsches Label
export const ACTION_LABEL_MAP: Record<AuditAction, string> = {
  "user.role_changed": "Rolle geändert",
  "user.deleted": "Benutzer gelöscht",
  "user.created": "Benutzer erstellt",
  "event.code_generated": "Event-Code generiert",
  "settings.changed": "Einstellung geändert",
  "user.login": "Anmeldung",
  "user.logout": "Abmeldung",
};
