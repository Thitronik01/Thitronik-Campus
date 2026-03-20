'use client'

import React from 'react'
import { FaqBlock as FaqBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Plus, Trash2, ChevronDown, GripVertical } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { cn } from '@/lib/utils'

interface FaqBlockProps {
  block: FaqBlockType
}

export function FaqBlock({ block }: FaqBlockProps) {
  const { updateBlock } = useCmsStore()

  const addItem = () => {
    updateBlock(block.id, {
      items: [...block.items, { id: uuidv4(), question: '', answer: '' }]
    })
  }

  const updateItem = (itemId: string, field: 'question' | 'answer', value: string) => {
    updateBlock(block.id, {
      items: block.items.map(item => item.id === itemId ? { ...item, [field]: value } : item)
    })
  }

  const removeItem = (itemId: string) => {
    updateBlock(block.id, {
      items: block.items.filter(item => item.id !== itemId)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-5 h-5 text-indigo-600" />
        <p className="text-sm font-bold text-brand-navy uppercase tracking-wider">Häufig gestellte Fragen (FAQ)</p>
      </div>

      <div className="space-y-4">
        {block.items.map((item, idx) => (
          <div key={item.id} className="relative group/faq bg-indigo-50/30 rounded-2xl border border-indigo-100 p-4 hover:bg-white hover:border-indigo-300 transition-all">
             <div className="flex items-start gap-4">
                <div className="pt-1 flex flex-col items-center gap-2">
                   <GripVertical className="w-4 h-4 text-indigo-300 cursor-grab opacity-0 group-hover/faq:opacity-100" />
                   <span className="text-[10px] font-bold text-indigo-400">Q{idx + 1}</span>
                </div>
                <div className="flex-1 space-y-3">
                  <Input
                    value={item.question}
                    onChange={(e) => updateItem(item.id, 'question', e.target.value)}
                    placeholder="Wird oft gefragt: ..."
                    className="font-bold text-brand-navy border-none p-0 h-auto focus-visible:ring-0 placeholder:text-indigo-200 bg-transparent"
                  />
                  <Textarea
                    value={item.answer}
                    onChange={(e) => updateItem(item.id, 'answer', e.target.value)}
                    placeholder="Die Antwort lautet..."
                    className="text-xs text-brand-ink/80 leading-relaxed border-none p-0 focus-visible:ring-0 placeholder:text-indigo-200 bg-transparent min-h-[60px] resize-none overflow-hidden"
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = 'auto'
                      target.style.height = `${target.scrollHeight}px`
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="h-8 w-8 text-neutral-400 hover:text-brand-red hover:bg-brand-red/10 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
             </div>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="w-full py-4 border-2 border-dashed border-indigo-100 rounded-2xl flex items-center justify-center gap-2 text-indigo-400 font-bold text-xs hover:bg-indigo-50 hover:border-indigo-300 transition-all group"
      >
        <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
        FAQ Eintrag hinzufügen
      </button>
    </div>
  )
}
