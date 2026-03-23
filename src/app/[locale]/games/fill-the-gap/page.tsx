"use client"

import React, { Suspense, useState, useCallback, useEffect } from "react"
import { PremiumBackground } from "@/components/layout/premium-background"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Brain } from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"
import FillTheGapGame from "@/components/games/fill-the-gap-game"
import { RoleGuard } from "@/components/auth/role-guard"
import { useBroadcastRoom } from "@/lib/multiplayer/useBroadcastRoom"
import { RoomLobby } from "@/lib/multiplayer/RoomLobby"
import { Scoreboard } from "@/lib/multiplayer/Scoreboard"
import { buildRoomUrl } from "@/lib/multiplayer/roomUtils"

function FillTheGapMultiplayer({ roomId, role: initialRole, locale }: { roomId: string; role: "host" | "participant", locale: string }) {
  const [playerName, setPlayerName] = useState("")
  const [nameSet, setNameSet] = useState(initialRole === "host")

  const {
      room, participants, clientId, updateGameState, setStatus, updateParticipantScore,
  } = useBroadcastRoom<any>({
      roomId,
      gameId: "fill-the-gap",
      role: initialRole,
      playerName: initialRole === "host" ? "Host" : playerName,
      initialGameState: { started: false },
  })

  const roomUrl = buildRoomUrl(locale, "fill-the-gap", roomId, "participant")

  const handleNameSubmit = useCallback((name: string) => {
      setPlayerName(name)
      setNameSet(true)
  }, [])

  const startGame = useCallback(() => {
      setStatus("running")
      updateGameState(() => ({ started: true }))
  }, [setStatus, updateGameState])

  const handleFinished = (score: number) => {
      updateParticipantScore(clientId, score)
      // Switch to scoreboard after a short delay
      setTimeout(() => {
        if (initialRole === "host") setStatus("finished")
      }, 2000)
  }

  // Name input
  if (!nameSet) {
      return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
              <RoomLobby roomId={roomId} roomUrl={roomUrl} isHost={false} participants={participants}
                  hostName={room?.host.name ?? "Host"} onStart={() => {}} onNameSubmit={handleNameSubmit} showNameInput />
          </div>
      )
  }

  // Lobby
  if (room?.status === "lobby") {
      return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-4">
              <div className="absolute top-4 left-4 z-20">
                  <Link href={`/${locale}/games`}><Button variant="ghost" className="gap-2 text-white hover:bg-white/20"><ArrowLeft className="w-4 h-4" /> Zurück</Button></Link>
              </div>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  Multiplayer Lückentext
              </motion.div>
              <RoomLobby roomId={roomId} roomUrl={roomUrl} isHost={initialRole === "host"} participants={participants}
                  hostName={room?.host.name ?? "Host"} onStart={startGame} />
          </div>
      )
  }

  // Finished
  if (room?.status === "finished") {
      return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
              <Scoreboard participants={participants} hostName={room?.host.name ?? "Host"} isHost={initialRole === "host"} onPlayAgain={() => {
                 participants.forEach((p) => updateParticipantScore(p.id, 0))
                 setStatus("lobby")
                 updateGameState(() => ({ started: false }))
              }} />
          </div>
      )
  }

  return (
    <PremiumBackground>
      <div className="min-h-screen p-4 md:p-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-4xl mx-auto space-y-6"
        >
          <div className="flex items-center gap-4 mb-4">
             <Link href={`/${locale}/games`}><Button variant="ghost" className="text-white hover:bg-white/10"><ArrowLeft className="w-4 h-4 mr-2" /> Beenden</Button></Link>
             <h1 className="text-2xl font-bold text-white">Live Lückentext</h1>
          </div>
          <FillTheGapGame onFinished={handleFinished} />
        </motion.div>
      </div>
    </PremiumBackground>
  )
}

function FillTheGapPageInner() {
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = (params?.locale as string) || "de"
  const roomId = searchParams.get("room")
  const role = searchParams.get("role") as "host" | "participant" | null

  if (roomId && (role === "host" || role === "participant")) {
      return (
          <RoleGuard requiredRole="user">
              <FillTheGapMultiplayer roomId={roomId} role={role} locale={locale} />
          </RoleGuard>
      )
  }

  return (
    <PremiumBackground>
      <div className="min-h-screen p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Header mit Zurück-Button */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" asChild>
              <Link href={`/${locale}/games`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Lückentext</h1>
              <p className="text-white/70">Fülle die Lücken in Sätzen über Thitronik-Produkte und Einbau-Wissen.</p>
            </div>
          </div>

          <FillTheGapGame />
        </motion.div>
      </div>
    </PremiumBackground>
  )
}

export default function FillTheGapPage() {
  return (
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950" />}>
          <FillTheGapPageInner />
      </Suspense>
  )
}
