'use client'

import React from 'react'
import { StepsBlock as StepsBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Layers, Plus, Trash2, GripVertical, CheckCircle2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { cn } from '@/lib/utils'

interface StepsBlockProps {
  block: StepsBlockType
}

export function StepsBlock({ block }: StepsBlockProps) {
  const { updateBlock } = useCmsStore()

  const addStep = () => {
    updateBlock(block.id, {
      steps: [...block.steps, { id: uuidv4(), title: '', description: '' }]
    })
  }

  const updateStep = (stepId: string, field: 'title' | 'description', value: string) => {
    updateBlock(block.id, {
      steps: block.steps.map(s => s.id === stepId ? { ...s, [field]: value } : s)
    })
  }

  const removeStep = (stepId: string) => {
    updateBlock(block.id, {
      steps: block.steps.filter(s => s.id !== stepId)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Layers className="w-5 h-5 text-emerald-600" />
        <Input
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
          placeholder="Schritt-für-Schritt Titel..."
          className="text-sm font-bold text-brand-navy uppercase tracking-wider border-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent"
        />
      </div>

      <div className="space-y-8 relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-100 before:rounded-full">
        {block.steps.map((step, idx) => (
          <div key={step.id} className="relative group/step">
             <div className="absolute -left-[27px] top-0 w-8 h-8 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-emerald-600 z-10 shadow-sm group-hover/step:scale-110 transition-transform">
               {idx + 1}
             </div>
             
             <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Input
                    value={step.title}
                    onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                    placeholder={`Titel für Schritt ${idx + 1}...`}
                    className="font-bold text-brand-navy border-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStep(step.id)}
                    className="h-8 w-8 text-neutral-400 hover:text-brand-red hover:bg-brand-red/10 rounded-xl opacity-0 group-hover/step:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  value={step.description}
                  onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                  placeholder="Was passiert in diesem Schritt?"
                  className="text-xs text-brand-ink/80 leading-relaxed border-none p-0 focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent min-h-[40px] resize-none overflow-hidden"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height = `${target.scrollHeight}px`
                  }}
                />
             </div>
          </div>
        ))}
      </div>

      <button
        onClick={addStep}
        className="flex items-center gap-2 text-xs font-bold text-brand-sky hover:text-brand-sky-dark transition-colors pl-7 group"
      >
        <div className="w-6 h-6 rounded-lg border border-brand-sky/30 flex items-center justify-center group-hover:bg-brand-sky/10">
          <Plus className="w-4 h-4" />
        </div>
        Schritt hinzufügen
      </button>
    </div>
  )
}
