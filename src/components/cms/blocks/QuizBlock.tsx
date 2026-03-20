'use client'

import React from 'react'
import { QuizBlock as QuizBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, HelpCircle, CheckCircle2, Star } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { cn } from '@/lib/utils'

interface QuizBlockProps {
  block: QuizBlockType
}

export function QuizBlock({ block }: QuizBlockProps) {
  const { updateBlock } = useCmsStore()

  const addOption = () => {
    updateBlock(block.id, {
      options: [...block.options, { id: uuidv4(), text: '', isCorrect: false }]
    })
  }

  const updateOptionText = (optionId: string, text: string) => {
    updateBlock(block.id, {
      options: block.options.map(opt => opt.id === optionId ? { ...opt, text } : opt)
    })
  }

  const setCorrectOption = (optionId: string) => {
    updateBlock(block.id, {
      options: block.options.map(opt => ({ ...opt, isCorrect: opt.id === optionId }))
    })
  }

  const removeOption = (optionId: string) => {
    if (block.options.length <= 1) return
    updateBlock(block.id, {
      options: block.options.filter(opt => opt.id !== optionId)
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <HelpCircle className="w-5 h-5 text-purple-600" />
             <p className="text-sm font-bold text-brand-navy uppercase tracking-wider">Quizfrage erstellen</p>
           </div>
           <div className="flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-full border border-purple-100">
             <Star className="w-3 h-3 fill-purple-500 text-purple-500" /> {block.xpReward || 25} XP
           </div>
        </div>
        <Input
          value={block.question}
          onChange={(e) => updateBlock(block.id, { question: e.target.value })}
          placeholder="Wie lautet die Frage?"
          className="text-lg font-bold text-brand-navy border-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30"
        />
      </div>

      <RadioGroup 
        value={block.options.find(o => o.isCorrect)?.id}
        onValueChange={setCorrectOption}
        className="space-y-3"
      >
        {block.options.map((option, idx) => (
          <div key={option.id} className="flex items-center gap-3 group/option">
            <RadioGroupItem 
              value={option.id} 
              id={option.id}
              className="border-border text-brand-sky data-[state=checked]:border-brand-sky"
            />
            <div className={cn(
               "flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all",
               option.isCorrect ? "bg-brand-sky/5 border-brand-sky shadow-sm shadow-brand-sky/10" : "bg-muted/30 border-border group-hover/option:bg-white group-hover/option:border-muted-foreground/30"
            )}>
              <span className="text-xs font-bold text-muted-foreground opacity-30">{String.fromCharCode(65 + idx)}</span>
              <Input
                value={option.text}
                onChange={(e) => updateOptionText(option.id, e.target.value)}
                placeholder={`Antwortmöglichkeit ${idx + 1}...`}
                className="flex-1 h-auto text-sm bg-transparent border-none p-0 focus-visible:ring-0 placeholder:text-muted-foreground/30"
              />
              {option.isCorrect && <CheckCircle2 className="w-4 h-4 text-brand-sky" />}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeOption(option.id)}
              disabled={block.options.length <= 1}
              className="h-9 w-9 opacity-0 group-hover/option:opacity-100 transition-opacity text-muted-foreground hover:text-brand-red hover:bg-brand-red/10 rounded-xl"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </RadioGroup>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={addOption}
          className="flex items-center gap-2 text-xs font-bold text-brand-sky hover:text-brand-sky-dark transition-colors pl-7 group"
        >
          <div className="w-6 h-6 rounded-lg border border-brand-sky/30 flex items-center justify-center group-hover:bg-brand-sky/10">
            <Plus className="w-4 h-4" />
          </div>
          Option hinzufügen
        </button>

        <div className="flex items-center gap-3">
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Erklärung (Optional)</p>
           <Input 
             value={block.explanation || ''}
             onChange={(e) => updateBlock(block.id, { explanation: e.target.value })}
             placeholder="Warum ist das korrekt?"
             className="h-8 text-[11px] w-48 rounded-lg border-border focus-visible:ring-brand-sky"
           />
        </div>
      </div>
    </div>
  )
}
