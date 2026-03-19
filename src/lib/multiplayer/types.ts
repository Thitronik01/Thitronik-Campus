// src/lib/multiplayer/types.ts
// Shared TypeScript types for the unified multiplayer system

/** Role a user can have in a multiplayer room */
export type MultiplayerRole = "host" | "participant";

/** Current status of a multiplayer game session */
export type MultiplayerStatus = "lobby" | "running" | "finished";

/** A participant in a multiplayer room */
export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  isReady: boolean;
  lastSeen: number;
}

/** Base room structure, generic over game-specific state */
export interface BaseRoom<TGameState> {
  roomId: string;
  gameId: string;
  host: {
    id: string;
    name: string;
  };
  participants: Participant[];
  status: MultiplayerStatus;
  gameState: TGameState;
  createdAt: string;
  updatedAt: string;
}

/** Message sent over BroadcastChannel */
export interface BroadcastMessage<T = unknown> {
  type: string;
  payload: T;
  senderId: string;
  timestamp: number;
}

// ----- Broadcast message types -----

/** Message types used by the multiplayer system */
export const MSG = {
  // Room lifecycle
  ROOM_STATE_SYNC: "room:state-sync",
  ROOM_STATUS_CHANGE: "room:status-change",

  // Participant management
  PARTICIPANT_JOIN: "participant:join",
  PARTICIPANT_LEAVE: "participant:leave",
  PARTICIPANT_READY: "participant:ready",
  PARTICIPANT_SCORE: "participant:score",

  // Heartbeat / presence
  HEARTBEAT_PING: "heartbeat:ping",
  HEARTBEAT_PONG: "heartbeat:pong",

  // Game actions (generic – games use sub-types)
  GAME_ACTION: "game:action",
  GAME_START: "game:start",
  GAME_END: "game:end",
} as const;

export type MessageType = (typeof MSG)[keyof typeof MSG];

// ----- Payloads for common messages -----

export interface JoinPayload {
  participant: Participant;
}

export interface ReadyPayload {
  participantId: string;
  isReady: boolean;
}

export interface ScorePayload {
  participantId: string;
  score: number;
}

export interface GameActionPayload<T = unknown> {
  action: string;
  data: T;
}

export interface HeartbeatPayload {
  senderId: string;
}
