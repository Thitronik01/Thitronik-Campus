'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { 
  GripVertical, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown,
  MoreVertical
} from 'lucide-react'
import { CMSBlock, CMSBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'

interface BlockWrapperProps {
  block: CMSBlock
  children: React.ReactNode
  isReadOnly?: boolean
}

const BLOCK_CONFIG: Record<CMSBlockType, { label: string; color: string; bg: string }> = {
  heading: { label: 'Überschrift', color: 'text-violet-700', bg: 'bg-violet-100' },
  text: { label: 'Fließtext', color: 'text-blue-700', bg: 'bg-blue-100' },
  video: { label: 'Video', color: 'text-pink-700', bg: 'bg-pink-100' },
  image: { label: 'Bild', color: 'text-green-700', bg: 'bg-green-100' },
  presentation: { label: 'Präsentation', color: 'text-orange-700', bg: 'bg-orange-100' },
  game: { label: 'Game', color: 'text-amber-700', bg: 'bg-amber-100' },
  tool: { label: 'Tool', color: 'text-red-700', bg: 'bg-red-100' },
  quiz: { label: 'Quiz', color: 'text-purple-700', bg: 'bg-purple-100' },
  checklist: { label: 'Checkliste', color: 'text-teal-700', bg: 'bg-teal-100' },
  faq: { label: 'FAQ', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  comparison: { label: 'Vergleich', color: 'text-cyan-700', bg: 'bg-cyan-100' },
  steps: { label: 'Schritte', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  cards: { label: 'Karten', color: 'text-blue-600', bg: 'bg-blue-50' },
  divider: { label: 'Trenner', color: 'text-gray-700', bg: 'bg-gray-100' },
}

export function BlockWrapper({ block, children, isReadOnly = false }: BlockWrapperProps) {
  const t = useTranslations('cms.blocks')
  const { removeBlock, duplicateBlock, moveBlock } = useCmsStore()
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const config = BLOCK_CONFIG[block.type]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative transition-all duration-250",
        isReadOnly 
          ? "mb-8" 
          : "mb-6 rounded-3xl border-2 p-px",
        isDragging 
          ? "opacity-30 z-50 ring-4 ring-brand-sky/20 border-brand-sky scale-[1.02] shadow-2xl" 
          : isReadOnly 
            ? "border-transparent" 
            : "border-transparent hover:border-brand-sky/30 hover:shadow-[0_8px_32px_rgba(74,173,206,0.08)] bg-white"
      )}
    >
      {!isReadOnly && (
        <div className={cn(
          "flex items-center justify-between px-4 py-3 border-b border-border/50 rounded-t-3xl",
          isDragging ? "bg-brand-sky/5" : "bg-white"
        )}>
          <div className="flex items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-brand-navy"
            >
              <GripVertical className="w-5 h-5" />
            </button>
            
            <Badge className={cn(
              "rounded-xl px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border-none shadow-sm",
              config.bg,
              config.color
            )}>
              {t(block.type)}
            </Badge>
            
            <span className="text-[10px] text-muted-foreground font-mono opacity-50">#{block.id.slice(0, 8)}</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => moveBlock(block.id, 'up')}
              className="h-8 w-8 text-muted-foreground hover:text-brand-navy hover:bg-brand-sky/10 rounded-lg"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => moveBlock(block.id, 'down')}
              className="h-8 w-8 text-muted-foreground hover:text-brand-navy hover:bg-brand-sky/10 rounded-lg"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
            <div className="w-px h-4 bg-border mx-1" />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => duplicateBlock(block.id)}
              className="h-8 w-8 text-muted-foreground hover:text-brand-sky hover:bg-brand-sky/10 rounded-lg"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => removeBlock(block.id)}
              className="h-8 w-8 text-muted-foreground hover:text-brand-red hover:bg-brand-red/10 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Block Content Wrapper */}
      <div className={cn(isReadOnly ? "" : "p-6")}>
        {children}
      </div>

      {!isReadOnly && (
        <div className="absolute -bottom-4 left-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center pointer-events-none">
          <button className="w-8 h-8 rounded-full bg-white border-2 border-brand-sky flex items-center justify-center text-brand-sky shadow-lg pointer-events-auto hover:scale-110 transition-transform hover:bg-brand-sky hover:text-white">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
