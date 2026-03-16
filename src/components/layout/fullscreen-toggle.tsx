"use client";

import { useState, useEffect, useRef } from "react";
import { Maximize, Minimize } from "lucide-react";

export function FullscreenToggle() {
    const [isFS, setFS] = useState(false);

    useEffect(() => {
        const h = () => setFS(!!(document.fullscreenElement || (document as any).webkitFullscreenElement));
        document.addEventListener("fullscreenchange", h);
        document.addEventListener("webkitfullscreenchange", h);
        return () => {
            document.removeEventListener("fullscreenchange", h);
            document.removeEventListener("webkitfullscreenchange", h);
        };
    }, []);

    const toggle = () => {
        const d = document as any;
        const el = d.documentElement;

        const isCurrentlyFS = !!(d.fullscreenElement || d.webkitFullscreenElement || el.getAttribute('data-fullscreen') === 'true');
        const nextState = !isCurrentlyFS;

        // 1. Toggle Scaling Mode (Immediate & Reliable)
        el.setAttribute('data-fullscreen', nextState ? 'true' : 'false');
        setFS(nextState);

        // 2. Attempt Browser Fullscreen (Optional/Bonus)
        try {
            if (nextState) {
                const f = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
                if (f) f.call(el).catch(() => { });
            } else {
                const x = d.exitFullscreen || d.webkitExitFullscreen || d.mozCancelFullScreen || d.msExitFullscreen;
                if (x && (d.fullscreenElement || d.webkitFullscreenElement)) x.call(d);
            }
        } catch (e) {
            // Silently fail as we have our Theater Mode scaling active anyway
        }
    };

    return (
        <button
            type="button"
            onClick={toggle}
            className={`fullscreen-toggle-btn fixed z-[9999] flex h-10 w-10 items-center justify-center rounded-lg shadow-lg transition-all cursor-pointer
                ${isFS
                    ? "top-4 right-4 bg-brand-lime text-brand-navy hover:scale-110 active:scale-95"
                    : "top-3 right-4 bg-brand-lime text-brand-navy hover:scale-110 active:scale-95 opacity-90"
                }`}
            title={isFS ? "Vollbild beenden" : "Vollbild"}
        >
            {isFS ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
    );
}
