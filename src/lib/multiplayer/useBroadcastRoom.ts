"use client";

// src/lib/multiplayer/useBroadcastRoom.ts
// Generic React hook for BroadcastChannel-based multiplayer rooms

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  BaseRoom,
  BroadcastMessage,
  MultiplayerRole,
  MultiplayerStatus,
  Participant,
} from "./types";
import { MSG } from "./types";
import {
  getClientId,
  getStorageKey,
  readRoomFromStorage,
  writeRoomToStorage,
} from "./roomUtils";

// ── Constants ──────────────────────────────────────────────
const HEARTBEAT_INTERVAL_MS = 5_000;
const PRESENCE_TIMEOUT_MS = 15_000;

// ── Hook options ───────────────────────────────────────────
export interface UseBroadcastRoomOptions<TGameState> {
  roomId: string | null;
  gameId: string;
  role: MultiplayerRole | null;
  playerName: string;
  /** Initial game state – only used when the host creates the room */
  initialGameState: TGameState;
}

// ── Hook return ────────────────────────────────────────────
export interface UseBroadcastRoomReturn<TGameState> {
  role: MultiplayerRole | null;
  room: BaseRoom<TGameState> | null;
  participants: Participant[];
  isConnected: boolean;
  clientId: string;
  /** Send a typed message to all peers */
  sendMessage: <T>(type: string, payload: T) => void;
  /** Host-only: replace the entire game state and broadcast it */
  updateGameState: (updater: (prev: TGameState) => TGameState) => void;
  /** Host-only: change room status (lobby → running → finished) */
  setStatus: (status: MultiplayerStatus) => void;
  /** Host-only: update a specific participant's score */
  updateParticipantScore: (participantId: string, score: number) => void;
}

// ── Hook implementation ────────────────────────────────────
export function useBroadcastRoom<TGameState>(
  options: UseBroadcastRoomOptions<TGameState>
): UseBroadcastRoomReturn<TGameState> {
  const { roomId, gameId, role, playerName, initialGameState } = options;

  const [room, setRoom] = useState<BaseRoom<TGameState> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clientIdRef = useRef<string>(getClientId());

  const clientId = clientIdRef.current;

  // ---- helpers ---------------------------------------------------------

  const readRoom = useCallback((): BaseRoom<TGameState> | null => {
    if (!roomId) return null;
    return readRoomFromStorage<BaseRoom<TGameState>>(roomId);
  }, [roomId]);

  const persistRoom = useCallback(
    (r: BaseRoom<TGameState>) => {
      if (!roomId) return;
      writeRoomToStorage(roomId, r);
    },
    [roomId]
  );

  const broadcast = useCallback(
    <T,>(type: string, payload: T) => {
      const ch = channelRef.current;
      if (!ch) return;
      const msg: BroadcastMessage<T> = {
        type,
        payload,
        senderId: clientId,
        timestamp: Date.now(),
      };
      ch.postMessage(msg);
    },
    [clientId]
  );

  /** Prune participants who haven't sent a heartbeat recently */
  const pruneParticipants = useCallback(
    (participants: Participant[]): Participant[] => {
      const cutoff = Date.now() - PRESENCE_TIMEOUT_MS;
      return participants.filter((p) => p.lastSeen >= cutoff);
    },
    []
  );

  // ---- initialise room (host) or join (participant) --------------------

  useEffect(() => {
    if (!roomId || !role) return;

    if (role === "host") {
      // Create room if it doesn't exist yet
      let existing = readRoom();
      if (!existing) {
        const newRoom: BaseRoom<TGameState> = {
          roomId,
          gameId,
          host: { id: clientId, name: playerName },
          participants: [],
          status: "lobby",
          gameState: initialGameState,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        persistRoom(newRoom);
        existing = newRoom;
      }
      setRoom(existing);
    } else {
      // Participant: read existing room
      const existing = readRoom();
      if (existing) {
        // Add self to participants if not already present
        const alreadyJoined = existing.participants.some(
          (p) => p.id === clientId
        );
        if (!alreadyJoined) {
          const me: Participant = {
            id: clientId,
            name: playerName,
            score: 0,
            isReady: false,
            lastSeen: Date.now(),
          };
          existing.participants.push(me);
          existing.updatedAt = new Date().toISOString();
          persistRoom(existing);
        }
        setRoom(existing);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, role]);

  // ---- BroadcastChannel setup ------------------------------------------

  useEffect(() => {
    if (!roomId || !role) return;
    if (typeof window === "undefined" || !("BroadcastChannel" in window))
      return;

    const channel = new BroadcastChannel(`mp-room-${roomId}`);
    channelRef.current = channel;
    setIsConnected(true);

    // Notify others of join
    if (role === "participant") {
      const me: Participant = {
        id: clientId,
        name: playerName,
        score: 0,
        isReady: false,
        lastSeen: Date.now(),
      };
      const msg: BroadcastMessage<{ participant: Participant }> = {
        type: MSG.PARTICIPANT_JOIN,
        payload: { participant: me },
        senderId: clientId,
        timestamp: Date.now(),
      };
      channel.postMessage(msg);
    }

    // ---- message handler ----
    const handleMessage = (ev: MessageEvent) => {
      const msg = ev.data as BroadcastMessage<unknown>;
      if (!msg || !msg.type) return;

      switch (msg.type) {
        case MSG.ROOM_STATE_SYNC: {
          // Host broadcasted updated room – participants adopt it
          const synced = msg.payload as BaseRoom<TGameState>;
          if (synced) {
            setRoom(synced);
            persistRoom(synced);
          }
          break;
        }

        case MSG.PARTICIPANT_JOIN: {
          if (role !== "host") break;
          const { participant } = msg.payload as { participant: Participant };
          setRoom((prev) => {
            if (!prev) return prev;
            const already = prev.participants.some(
              (p) => p.id === participant.id
            );
            const next: BaseRoom<TGameState> = {
              ...prev,
              participants: already
                ? prev.participants.map((p) =>
                    p.id === participant.id
                      ? { ...p, lastSeen: Date.now() }
                      : p
                  )
                : [...prev.participants, { ...participant, lastSeen: Date.now() }],
              updatedAt: new Date().toISOString(),
            };
            persistRoom(next);
            // Broadcast updated room to all
            const syncMsg: BroadcastMessage<BaseRoom<TGameState>> = {
              type: MSG.ROOM_STATE_SYNC,
              payload: next,
              senderId: clientId,
              timestamp: Date.now(),
            };
            channel.postMessage(syncMsg);
            return next;
          });
          break;
        }

        case MSG.PARTICIPANT_LEAVE: {
          if (role !== "host") break;
          const { participantId } = msg.payload as { participantId: string };
          setRoom((prev) => {
            if (!prev) return prev;
            const next: BaseRoom<TGameState> = {
              ...prev,
              participants: prev.participants.filter(
                (p) => p.id !== participantId
              ),
              updatedAt: new Date().toISOString(),
            };
            persistRoom(next);
            return next;
          });
          break;
        }

        case MSG.HEARTBEAT_PING: {
          // Respond with pong
          if (role === "host") {
            const pong: BroadcastMessage<{ senderId: string }> = {
              type: MSG.HEARTBEAT_PONG,
              payload: { senderId: clientId },
              senderId: clientId,
              timestamp: Date.now(),
            };
            channel.postMessage(pong);

            // Update participant's lastSeen
            const pingData = msg.payload as { senderId: string };
            setRoom((prev) => {
              if (!prev) return prev;
              const next: BaseRoom<TGameState> = {
                ...prev,
                participants: prev.participants.map((p) =>
                  p.id === pingData.senderId
                    ? { ...p, lastSeen: Date.now() }
                    : p
                ),
              };
              persistRoom(next);
              return next;
            });
          }
          break;
        }

        case MSG.HEARTBEAT_PONG: {
          setIsConnected(true);
          break;
        }

        case MSG.GAME_ACTION: {
          // Game-specific actions – host processes them, participants ignore
          // The game component listens to room.gameState changes
          // This is handled by the game implementation calling onGameAction
          break;
        }

        default:
          break;
      }
    };

    channel.addEventListener("message", handleMessage);

    // Also listen for localStorage changes (cross-tab fallback)
    const handleStorage = (ev: StorageEvent) => {
      if (ev.key === getStorageKey(roomId)) {
        const updated = readRoom();
        if (updated) setRoom(updated);
      }
    };
    window.addEventListener("storage", handleStorage);

    // ---- heartbeat ----
    heartbeatRef.current = setInterval(() => {
      if (role === "participant") {
        const ping: BroadcastMessage<{ senderId: string }> = {
          type: MSG.HEARTBEAT_PING,
          payload: { senderId: clientId },
          senderId: clientId,
          timestamp: Date.now(),
        };
        channel.postMessage(ping);
      } else {
        // Host: prune stale participants
        setRoom((prev) => {
          if (!prev) return prev;
          const pruned = pruneParticipants(prev.participants);
          if (pruned.length === prev.participants.length) return prev;
          const next: BaseRoom<TGameState> = {
            ...prev,
            participants: pruned,
            updatedAt: new Date().toISOString(),
          };
          persistRoom(next);
          return next;
        });
      }
    }, HEARTBEAT_INTERVAL_MS);

    // ---- cleanup ----
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);

      // Notify leave
      if (role === "participant") {
        const leaveMsg: BroadcastMessage<{ participantId: string }> = {
          type: MSG.PARTICIPANT_LEAVE,
          payload: { participantId: clientId },
          senderId: clientId,
          timestamp: Date.now(),
        };
        channel.postMessage(leaveMsg);
      }

      channel.removeEventListener("message", handleMessage);
      window.removeEventListener("storage", handleStorage);
      channel.close();
      channelRef.current = null;
      setIsConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, role]);

  // ---- public API ------------------------------------------------------

  const sendMessage = useCallback(
    <T,>(type: string, payload: T) => {
      broadcast(type, payload);
    },
    [broadcast]
  );

  const updateGameState = useCallback(
    (updater: (prev: TGameState) => TGameState) => {
      setRoom((prev) => {
        if (!prev) return prev;
        const nextState = updater(prev.gameState);
        const next: BaseRoom<TGameState> = {
          ...prev,
          gameState: nextState,
          updatedAt: new Date().toISOString(),
        };
        persistRoom(next);
        // Broadcast full room state to participants
        broadcast(MSG.ROOM_STATE_SYNC, next);
        return next;
      });
    },
    [persistRoom, broadcast]
  );

  const setStatus = useCallback(
    (status: MultiplayerStatus) => {
      setRoom((prev) => {
        if (!prev) return prev;
        const next: BaseRoom<TGameState> = {
          ...prev,
          status,
          updatedAt: new Date().toISOString(),
        };
        persistRoom(next);
        broadcast(MSG.ROOM_STATE_SYNC, next);
        return next;
      });
    },
    [persistRoom, broadcast]
  );

  const updateParticipantScore = useCallback(
    (participantId: string, score: number) => {
      setRoom((prev) => {
        if (!prev) return prev;
        const next: BaseRoom<TGameState> = {
          ...prev,
          participants: prev.participants.map((p) =>
            p.id === participantId ? { ...p, score } : p
          ),
          updatedAt: new Date().toISOString(),
        };
        persistRoom(next);
        broadcast(MSG.ROOM_STATE_SYNC, next);
        return next;
      });
    },
    [persistRoom, broadcast]
  );

  return {
    role,
    room,
    participants: room?.participants ?? [],
    isConnected,
    clientId,
    sendMessage,
    updateGameState,
    setStatus,
    updateParticipantScore,
  };
}
