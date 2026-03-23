"use client";

import { motion } from "framer-motion";
import React from "react";

interface PremiumBackgroundProps {
    children: React.ReactNode;
    blurAmount?: string;
    overlayOpacity?: string;
}

export function PremiumBackground({
    children,
    blurAmount = "2px",
    overlayOpacity = "bg-brand-navy/60"
}: PremiumBackgroundProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-[calc(100vh-120px)] rounded-3xl overflow-hidden"
        >
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
                    style={{
                        backgroundImage: "url('/background.png')",
                    }}
                />
                {/* Glassmorphism Overlay */}
                <div className={`absolute inset-0 ${overlayOpacity} backdrop-blur-[${blurAmount}]`} />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/40 via-transparent to-brand-navy/40" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
