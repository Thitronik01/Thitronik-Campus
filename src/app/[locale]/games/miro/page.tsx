"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { MiroBoard } from "@/components/interactive/miro-board";
import { writeRoomToStorage } from "@/lib/multiplayer/roomUtils";

/**
 * Miro is inherently collaborative (shared whiteboard URL).
 * For multiplayer, we just write a room stub so the join page can resolve it,
 * and display the same Miro board for all participants.
 */
function MiroMultiplayerBridge({ roomId }: { roomId: string }) {
    useEffect(() => {
        writeRoomToStorage(roomId, {
            roomId,
            gameId: "miro",
            status: "running",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }, [roomId]);

    return <MiroBoard />;
}

function MiroPageInner() {
    const searchParams = useSearchParams();
    const roomId = searchParams.get("room");

    if (roomId) {
        return (
            <RoleGuard requiredRole="user">
                <MiroMultiplayerBridge roomId={roomId} />
            </RoleGuard>
        );
    }

    return (
        <RoleGuard requiredRole="user">
            <MiroBoard />
        </RoleGuard>
    );
}

export default function MiroPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0a1628]" />}>
            <MiroPageInner />
        </Suspense>
    );
}
