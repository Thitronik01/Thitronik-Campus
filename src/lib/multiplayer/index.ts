// src/lib/multiplayer/index.ts
// Barrel export for the multiplayer module

export * from "./types";
export * from "./roomUtils";
export { useBroadcastRoom } from "./useBroadcastRoom";
export type { UseBroadcastRoomOptions, UseBroadcastRoomReturn } from "./useBroadcastRoom";
export { RoomLobby } from "./RoomLobby";
export { Scoreboard } from "./Scoreboard";
