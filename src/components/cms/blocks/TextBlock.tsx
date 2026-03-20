'use client'

import React from 'react'
import { TextBlock as TextBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { Textarea } from '@/components/ui/textarea'

interface TextBlockProps {
  block: TextBlockType
}

export function TextBlock({ block }: TextBlockProps) {
  const { updateBlock } = useCmsStore()

  return (
    <div className="space-y-2">
      <Textarea
        value={block.content}
        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
        placeholder="Text hier verfassen... (Markdown unterstützt)"
        className="min-h-[120px] w-full bg-transparent border-none p-0 focus-visible:ring-0 text-sm leading-relaxed placeholder:text-muted-foreground/30 resize-none overflow-hidden"
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement
          target.style.height = 'auto'
          target.style.height = `${target.scrollHeight}px`
        }}
      />
    </div>
  )
}
