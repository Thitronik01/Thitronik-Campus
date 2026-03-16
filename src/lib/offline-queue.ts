import { openDB, DBSchema } from "idb";

interface CampusDb extends DBSchema {
    syncQueue: {
        key: string;
        value: {
            id: string;
            action: string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            payload: any;
            timestamp: number;
        };
    };
}

// Initialisiere die Datenbank
const dbPromise =
    typeof window !== "undefined"
        ? openDB<CampusDb>("thitronik-campus-db", 1, {
            upgrade(db) {
                db.createObjectStore("syncQueue", { keyPath: "id" });
            },
        })
        : null;

/**
 * Reiht eine Aktion in die Offline-Warteschlange ein.
 * Wird verwendet, um Abgaben/Erfolge zu speichern, wenn der Nutzer im Funkloch ist.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function enqueueAction(action: string, payload: any) {
    if (!dbPromise) return;
    const db = await dbPromise;
    const id = crypto.randomUUID();
    await db.add("syncQueue", {
        id,
        action,
        payload,
        timestamp: Date.now(),
    });

    // Versuch zur sofortigen Synchronisierung, falls online
    if (navigator.onLine) {
        syncOfflineQueue();
    }
}

/**
 * Verarbeitet die Offline-Warteschlange, sobald das Gerät wieder online ist.
 */
export async function syncOfflineQueue() {
    if (!dbPromise) return;
    const db = await dbPromise;
    const allTx = await db.getAll("syncQueue");

    if (allTx.length === 0) return;

    console.log(`[Offline-Queue] 🔄 Synchronisiere ${allTx.length} ausstehende Aktionen...`);

    for (const tx of allTx) {
        try {
            // TODO: Echter Supabase Backend API Call hier
            console.log(`[Offline-Queue] ✅ Verarbeite Action: ${tx.action}`, tx.payload);

            // Nach erfolgreichem Backend-Call Eintrag aus lokaler idb entfernen
            await db.delete("syncQueue", tx.id);
        } catch (error) {
            console.error(`[Offline-Queue] ❌ Fehler bei Action ${tx.action}`, error);
            // Bleibt in idb und wird beim nächsten Online-Event erneut versucht
        }
    }
}

// Globaler Event-Listener für Wiederherstellung der Netzwerkverbindung
if (typeof window !== "undefined") {
    window.addEventListener("online", syncOfflineQueue);
}
