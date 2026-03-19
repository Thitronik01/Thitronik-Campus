"use client";

// src/lib/multiplayer/RoomLobby.tsx
// Reusable lobby component with QR code, participant list, and start button

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Users, Crown, QrCode, Copy, Check } from "lucide-react";
import type { Participant } from "./types";

interface RoomLobbyProps {
  roomId: string;
  roomUrl: string;
  isHost: boolean;
  participants: Participant[];
  hostName: string;
  onStart: () => void;
  onNameSubmit?: (name: string) => void;
  showNameInput?: boolean;
}

export function RoomLobby({
  roomId,
  roomUrl,
  isHost,
  participants,
  hostName,
  onStart,
  onNameSubmit,
  showNameInput = false,
}: RoomLobbyProps) {
  const t = useTranslations("multiplayer.lobby");
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  const handleNameSubmit = () => {
    if (name.trim().length >= 2 && onNameSubmit) {
      onNameSubmit(name.trim());
    }
  };

  if (showNameInput && onNameSubmit) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">👋</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t("title")}
            </h2>
            <p className="text-white/60 text-sm">
              {t("joinCode")}: <span className="font-mono font-bold text-brand-lime tracking-widest">{roomId}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/60 block mb-2">
                {t("yourName")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                placeholder="Max"
                maxLength={20}
                autoFocus
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand-lime/60 focus:ring-1 focus:ring-brand-lime/30 transition-all text-lg"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNameSubmit}
              disabled={name.trim().length < 2}
              className="w-full py-3 rounded-xl font-bold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-brand-lime text-brand-navy hover:bg-brand-lime/90"
            >
              Beitreten 🚀
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row gap-6 items-start justify-center max-w-4xl mx-auto"
    >
      {/* Left: QR Code & Room Info */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full lg:w-96 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <QrCode className="w-5 h-5 text-brand-lime" />
          <h2 className="text-xl font-bold text-white">{t("title")}</h2>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <QRCodeSVG
              value={roomUrl}
              size={180}
              bgColor="#ffffff"
              fgColor="#0a1628"
              level="M"
            />
          </div>
        </div>

        <p className="text-center text-white/50 text-xs mb-4">
          {t("scanToJoin")}
        </p>

        {/* Room Code */}
        <div className="bg-white/10 rounded-xl p-4 text-center mb-4">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
            {t("joinCode")}
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-black tracking-[0.3em] text-brand-lime font-mono">
              {roomId}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-white/60" />
              )}
            </button>
          </div>
        </div>

        {/* Host Start Button */}
        {isHost && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            disabled={participants.length === 0}
            className="w-full py-3 rounded-xl font-bold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-brand-lime text-brand-navy hover:bg-brand-lime/90 mt-4"
          >
            {t("startGame")} 🚀
          </motion.button>
        )}

        {!isHost && (
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
              <span className="text-white/60 text-sm">{t("waitingForPlayers")}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Right: Participant List */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full lg:flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-5 h-5 text-brand-lime" />
          <h2 className="text-xl font-bold text-white">
            {t("players")}
            <span className="text-white/40 font-normal text-base ml-2">
              ({participants.length + 1})
            </span>
          </h2>
        </div>

        <div className="space-y-2">
          {/* Host */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-brand-lime/10 border border-brand-lime/20"
          >
            <div className="w-10 h-10 rounded-full bg-brand-lime/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-brand-lime" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{hostName}</p>
              <p className="text-brand-lime text-xs">Host</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-brand-lime" />
          </motion.div>

          {/* Participants */}
          <AnimatePresence>
            {participants.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                  {p.avatar || "👤"}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{p.name}</p>
                  <p className="text-white/40 text-xs">
                    {p.isReady ? "✅ Bereit" : "⏳ Wartet..."}
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </motion.div>
            ))}
          </AnimatePresence>

          {participants.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="text-4xl mb-3">🎮</div>
              <p className="text-white/40 text-sm">{t("waitingForPlayers")}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
