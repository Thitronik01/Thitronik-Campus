'use client'

import React from 'react'
import { ChecklistBlock as ChecklistBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

interface ChecklistBlockProps {
  block: ChecklistBlockType
}

export function ChecklistBlock({ block }: ChecklistBlockProps) {
  const { updateBlock } = useCmsStore()

  const addItem = () => {
    updateBlock(block.id, {
      items: [...block.items, { id: uuidv4(), label: '', checked: false }]
    })
  }

  const updateItem = (itemId: string, label: string) => {
    updateBlock(block.id, {
      items: block.items.map(item => item.id === itemId ? { ...item, label } : item)
    })
  }

  const removeItem = (itemId: string) => {
    updateBlock(block.id, {
      items: block.items.filter(item => item.id !== itemId)
    })
  }

  return (
    <div className="space-y-4">
      <Input
        value={block.title}
        onChange={(e) => updateBlock(block.id, { title: e.target.value })}
        placeholder="Checklisten-Titel..."
        className="text-lg font-bold text-brand-navy border-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30"
      />
      
      <div className="space-y-2">
        {block.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 group/item">
            <GripVertical className="w-4 h-4 text-muted-foreground/30 opacity-0 group-hover/item:opacity-100 transition-opacity cursor-grab" />
            <Checkbox checked={item.checked} className="rounded-md border-border data-[state=checked]:bg-brand-sky data-[state=checked]:border-brand-sky" />
            <Input
              value={item.label}
              onChange={(e) => updateItem(item.id, e.target.value)}
              placeholder="Aufgabe beschreiben..."
              className="flex-1 h-8 text-sm border-none focus-visible:ring-0 px-0 placeholder:text-muted-foreground/30"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.id)}
              className="h-8 w-8 opacity-0 group-hover/item:opacity-100 transition-opacity text-muted-foreground hover:text-brand-red hover:bg-brand-red/10 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        
        <button
          onClick={addItem}
          className="flex items-center gap-2 text-xs font-bold text-brand-sky hover:text-brand-sky-dark transition-colors mt-2 pl-7 group"
        >
          <div className="w-5 h-5 rounded-lg border border-brand-sky/30 flex items-center justify-center group-hover:bg-brand-sky/10">
            <Plus className="w-3 h-3" />
          </div>
          Item hinzufügen
        </button>
      </div>
    </div>
  )
}
