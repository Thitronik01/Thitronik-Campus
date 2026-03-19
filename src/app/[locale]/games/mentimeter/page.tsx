"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RoleGuard } from "@/components/auth/role-guard";
import { MentimeterClone } from "@/components/interactive/mentimeter";
import { writeRoomToStorage } from "@/lib/multiplayer/roomUtils";
import { useEffect } from "react";

/**
 * When entering via the unified multiplayer entry (?room=X&role=host),
 * we create a stub in localStorage so the join page can resolve the game type.
 * Mentimeter has its own internal room management, so the actual gameplay
 * continues to use its self-contained BroadcastChannel system.
 */
function MentimeterMultiplayerBridge({ roomId }: { roomId: string }) {
    useEffect(() => {
        // Write a minimal room entry so join page can resolve gameId
        writeRoomToStorage(roomId, {
            roomId,
            gameId: "mentimeter",
            status: "lobby",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }, [roomId]);

    return <MentimeterClone />;
}

function MentimeterPageInner() {
    const searchParams = useSearchParams();
    const roomId = searchParams.get("room");

    if (roomId) {
        return (
            <RoleGuard requiredRole="user">
                <MentimeterMultiplayerBridge roomId={roomId} />
            </RoleGuard>
        );
    }

    return (
        <RoleGuard requiredRole="user">
            <MentimeterClone />
        </RoleGuard>
    );
}

export default function MentimeterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0a0e1a]" />}>
            <MentimeterPageInner />
        </Suspense>
    );
}
