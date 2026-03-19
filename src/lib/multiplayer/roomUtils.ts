// src/lib/multiplayer/roomUtils.ts
// Utility functions for room management

import type { MultiplayerRole } from "./types";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_CODE_LENGTH = 6;
const STORAGE_PREFIX = "mp-room-v1:";

/**
 * Generate a 6-character alphanumeric room code.
 * Uses crypto.getRandomValues for better randomness when available.
 */
export function generateRoomId(): string {
  const chars: string[] = [];
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const arr = new Uint8Array(ROOM_CODE_LENGTH);
    crypto.getRandomValues(arr);
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
      chars.push(ALPHABET[arr[i] % ALPHABET.length]);
    }
  } else {
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
      chars.push(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
    }
  }
  return chars.join("");
}

/**
 * Build a full room URL for a given game.
 */
export function buildRoomUrl(
  locale: string,
  gameId: string,
  roomId: string,
  role: MultiplayerRole = "host"
): string {
  const base =
    typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/${locale}/games/${gameId}?room=${roomId}&role=${role}`;
}

/**
 * Parse room parameters from URL search params.
 */
export function parseRoomFromUrl(
  searchParams: URLSearchParams
): { roomId: string | null; role: MultiplayerRole | null } {
  const roomId = searchParams.get("room");
  const roleRaw = searchParams.get("role");
  const role: MultiplayerRole | null =
    roleRaw === "host" || roleRaw === "participant" ? roleRaw : null;
  return { roomId, role };
}

// ---- localStorage room persistence ----

export function getStorageKey(roomId: string): string {
  return `${STORAGE_PREFIX}${roomId.toUpperCase()}`;
}

export function readRoomFromStorage<T>(roomId: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(getStorageKey(roomId));
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeRoomToStorage<T>(roomId: string, data: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getStorageKey(roomId), JSON.stringify(data));
}

export function removeRoomFromStorage(roomId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(getStorageKey(roomId));
}

/**
 * Generate a unique client ID, persisted in sessionStorage for the tab lifetime.
 */
export function getClientId(): string {
  if (typeof window === "undefined") return `client_${Date.now()}`;
  const key = "mp-client-id";
  let id = window.sessionStorage.getItem(key);
  if (!id) {
    id = `client_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    window.sessionStorage.setItem(key, id);
  }
  return id;
}

/**
 * Resolve the game ID from a room stored in localStorage.
 * Used by the join page to redirect to the correct game.
 */
export function resolveGameFromRoom(roomId: string): string | null {
  const room = readRoomFromStorage<{ gameId?: string }>(roomId);
  return room?.gameId ?? null;
}
