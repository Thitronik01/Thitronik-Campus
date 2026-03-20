'use client'

import React from 'react'
import { CardsBlock as CardsBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { LayoutGrid, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

interface CardsBlockProps {
  block: CardsBlockType
}

export function CardsBlock({ block }: CardsBlockProps) {
  const { updateBlock } = useCmsStore()

  const addCard = () => {
    updateBlock(block.id, {
      cards: [...block.cards, { id: uuidv4(), title: '', content: '' }]
    })
  }

  const updateCard = (cardId: string, field: 'title' | 'content', value: string) => {
    updateBlock(block.id, {
      cards: block.cards.map(c => c.id === cardId ? { ...c, [field]: value } : c)
    })
  }

  const removeCard = (cardId: string) => {
    updateBlock(block.id, {
      cards: block.cards.filter(c => c.id !== cardId)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <LayoutGrid className="w-5 h-5 text-blue-500" />
        <Input
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
          placeholder="Karten-Grid Titel..."
          className="text-sm font-bold text-brand-navy uppercase tracking-wider border-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {block.cards.map((card, idx) => (
          <div key={card.id} className="p-5 rounded-3xl border border-border bg-white shadow-sm hover:shadow-lg hover:border-brand-sky/30 transition-all group/card relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-brand-sky opacity-20" />
             
             <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover/card:bg-brand-sky/10 group-hover/card:text-brand-sky transition-colors cursor-pointer">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCard(card.id)}
                  className="h-8 w-8 text-neutral-400 hover:text-brand-red hover:bg-brand-red/10 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
             </div>

             <div className="space-y-2">
                <Input
                  value={card.title}
                  onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                  placeholder="Karten-Titel..."
                  className="font-bold text-brand-navy border-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent"
                />
                <Textarea
                  value={card.content}
                  onChange={(e) => updateCard(card.id, 'content', e.target.value)}
                  placeholder="Inhalt der Karte beschreiben..."
                  className="text-xs text-brand-ink/70 leading-relaxed border-none p-0 focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent min-h-[60px] resize-none overflow-hidden"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height = `${target.scrollHeight}px`
                  }}
                />
             </div>
          </div>
        ))}

        <button
          onClick={addCard}
          className="border-2 border-dashed border-border rounded-3xl p-6 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-brand-sky hover:bg-brand-sky/5 hover:text-brand-sky transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-brand-sky/10 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold">Karte hinzufügen</p>
        </button>
      </div>
    </div>
  )
}
