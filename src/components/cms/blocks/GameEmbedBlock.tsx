'use client'

import React from 'react'
import { GameEmbedBlock as GameEmbedBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Gamepad2, Info, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface GameEmbedBlockProps {
  block: GameEmbedBlockType
}

const AVAILABLE_GAMES = [
  { id: 'was-bin-ich', name: 'Was bin ich?', icon: '🤔', description: 'Produkte anhand von Hinweisen erraten.' },
  { id: 'memory', name: 'Thitronik Memory', icon: '🧩', description: 'Paare finden und Begriffe lernen.' },
  { id: 'order', name: 'Sortier-Meister', icon: '🔢', description: 'Prozesse in die richtige Reihenfolge bringen.' },
  { id: 'quiz', name: 'Expert Quiz', icon: '🏆', description: 'Wissensfragen mit Zeitdruck.' },
]

export function GameEmbedBlock({ block }: GameEmbedBlockProps) {
  const { updateBlock } = useCmsStore()

  const selectedGame = AVAILABLE_GAMES.find(g => g.id === block.gameId)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Gamepad2 className="w-5 h-5 text-amber-600" />
        <p className="text-sm font-bold text-brand-navy uppercase tracking-wider">Interaktives Game wählen</p>
      </div>

      <Select 
        value={block.gameId} 
        onValueChange={(val) => {
          const game = AVAILABLE_GAMES.find(g => g.id === val)
          updateBlock(block.id, { gameId: val, title: game?.name || '' })
        }}
      >
        <SelectTrigger className="w-full h-12 rounded-2xl border-border bg-white hover:bg-muted/50 transition-colors focus:ring-brand-sky">
          <SelectValue placeholder="Wähle ein Spiel aus..." />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-border shadow-[var(--shadow-dropdown)]">
          {AVAILABLE_GAMES.map((game) => (
            <SelectItem key={game.id} value={game.id} className="rounded-xl focus:bg-brand-sky/10 focus:text-brand-navy cursor-pointer py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{game.icon}</span>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{game.name}</span>
                  <span className="text-[10px] text-muted-foreground">{game.description}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedGame && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-4 animate-fade-in relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Gamepad2 className="w-16 h-16 text-amber-900" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
            {selectedGame.icon}
          </div>
          <div className="flex-1 space-y-1">
             <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-amber-900">{selectedGame.name}</h4>
                <Badge className="bg-amber-100 text-amber-700 border-none text-[9px] font-extrabold px-1.5 h-4">MULTI-PLAYER</Badge>
             </div>
             <p className="text-xs text-amber-800/80 leading-relaxed">{selectedGame.description}</p>
             <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-white/50 px-2 py-0.5 rounded-lg">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {block.xpReward || 50} XP
                </div>
                {block.isRequired && (
                   <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-white/50 px-2 py-0.5 rounded-lg">
                    <Info className="w-3 h-3 text-amber-500" /> PFLICHT
                  </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
