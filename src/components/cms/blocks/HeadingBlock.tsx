'use client'

import React from 'react'
import { HeadingBlock as HeadingBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeadingBlockProps {
  block: HeadingBlockType
}

export function HeadingBlock({ block }: HeadingBlockProps) {
  const { updateBlock } = useCmsStore()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((level) => (
          <Button
            key={level}
            variant={block.level === level ? "default" : "outline"}
            size="sm"
            onClick={() => updateBlock(block.id, { level: level as 1 | 2 | 3 })}
            className={cn(
              "h-7 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider",
              block.level === level 
                ? "bg-brand-navy text-white hover:bg-brand-navy-light" 
                : "border-border text-muted-foreground hover:bg-brand-navy/5 hover:text-brand-navy"
            )}
          >
            H{level}
          </Button>
        ))}
      </div>
      
      <Input
        value={block.text}
        onChange={(e) => updateBlock(block.id, { text: e.target.value })}
        placeholder="Überschrift eingeben..."
        className={cn(
          "w-full bg-transparent border-none p-0 focus-visible:ring-0 placeholder:text-muted-foreground/30",
          block.level === 1 && "text-3xl font-extrabold tracking-tight text-brand-navy h-auto",
          block.level === 2 && "text-2xl font-bold tracking-tight text-brand-navy h-auto",
          block.level === 3 && "text-xl font-bold text-brand-navy h-auto"
        )}
      />
    </div>
  )
}
