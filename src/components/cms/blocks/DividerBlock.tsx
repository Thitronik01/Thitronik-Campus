'use client'

import React from 'react'
import { DividerBlock as DividerBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DividerBlockProps {
  block: DividerBlockType
}

export function DividerBlock({ block }: DividerBlockProps) {
  const { updateBlock } = useCmsStore()

  const styles = [
    { id: 'solid', label: 'Solid' },
    { id: 'dashed', label: 'Dashed' },
    { id: 'dotted', label: 'Dotted' },
    { id: 'gradient', label: 'Gradient' }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 right-4 bg-white border border-border p-1 rounded-xl shadow-sm z-10">
        {styles.map((s) => (
          <Button
            key={s.id}
            variant={block.style === s.id ? "secondary" : "ghost"}
            size="sm"
            onClick={() => updateBlock(block.id, { style: s.id as any })}
            className={cn(
              "h-7 px-2 text-[10px] font-bold rounded-lg",
              block.style === s.id ? "bg-brand-sky/10 text-brand-sky" : "text-muted-foreground"
            )}
          >
            {s.label}
          </Button>
        ))}
      </div>

      <div className="py-4 flex items-center justify-center">
        {block.style === 'solid' && <div className="w-full h-px bg-border" />}
        {block.style === 'dashed' && <div className="w-full h-px border-b border-dashed border-border" />}
        {block.style === 'dotted' && <div className="w-full h-px border-b border-dotted border-border border-[3px]" />}
        {block.style === 'gradient' && <div className="w-full h-1 bg-gradient-to-r from-transparent via-brand-sky to-transparent opacity-30 rounded-full" />}
      </div>
    </div>
  )
}
