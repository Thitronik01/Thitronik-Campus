'use client'

import React from 'react'
import { PresentationBlock as PresentationBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { Button } from '@/components/ui/button'
import { FileText, Upload, X, Eye } from 'lucide-react'

interface PresentationBlockProps {
  block: PresentationBlockType
}

export function PresentationBlock({ block }: PresentationBlockProps) {
  const { updateBlock } = useCmsStore()

  return (
    <div className="space-y-4">
      {block.fileId ? (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl border border-border group">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-brand-navy truncate">{block.title || 'Präsentation.pdf'}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{block.slideCount || 0} Folien • 4.2 MB</p>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" className="h-8 rounded-lg text-brand-sky hover:bg-brand-sky/10">
              <Eye className="w-4 h-4 mr-2" /> Vorschau
            </Button>
            <Button size="sm" variant="ghost" onClick={() => updateBlock(block.id, { fileId: '' })} className="h-8 rounded-lg text-brand-red hover:bg-brand-red/10">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-brand-sky hover:bg-brand-sky/5 transition-all cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-brand-navy">Präsentation hochladen</p>
            <p className="text-[10px] text-muted-foreground">PDF oder PPTX (max. 50MB)</p>
          </div>
        </div>
      )}
    </div>
  )
}
