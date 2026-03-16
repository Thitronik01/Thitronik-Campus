"use client";

import React, { useEffect, useState } from "react";

export function XpPopup() {
    const [notifications, setNotifications] = useState<
        { id: number; amount: number; reason: string }[]
    >([]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleXp = (e: any) => {
            const id = Date.now();
            setNotifications((prev) => [
                ...prev,
                { id, amount: e.detail.amount, reason: e.detail.reason },
            ]);

            // Remove notification after 4 seconds
            setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            }, 4000);
        };

        window.addEventListener("add-xp", handleXp);
        return () => window.removeEventListener("add-xp", handleXp);
    }, []);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col gap-3 z-50 pointer-events-none">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className="bg-background px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-2 border-brand-sky/30 flex items-center gap-4 transform transition-all"
                    style={{
                        animation: "slide-up 0.4s ease-out forwards, fade-out 0.4s ease-out 3.6s forwards",
                    }}
                >
                    <div className="text-4xl animate-bounce" style={{ animationDuration: "2s" }}>
                        ⭐
                    </div>
                    <div>
                        <div className="font-extrabold text-brand-sky text-2xl">+{n.amount} XP</div>
                        <div className="text-sm font-semibold text-muted-foreground">{n.reason}</div>
                    </div>
                </div>
            ))}

            <style>{`
        @keyframes slide-up {
            from { opacity: 0; transform: translateY(50px) scale(0.9); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fade-out {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(-20px) scale(0.95); }
        }
      `}</style>
        </div>
    );
}
