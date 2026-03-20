'use client'

import React from 'react'
import { ImageBlock as ImageBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, Upload, X, Grid } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageBlockProps {
  block: ImageBlockType
}

export function ImageBlock({ block }: ImageBlockProps) {
  const { updateBlock } = useCmsStore()

  return (
    <div className="space-y-4">
      {block.url || block.fileId ? (
        <div className="relative group/image">
           <div className="rounded-2xl overflow-hidden border border-border bg-muted flex items-center justify-center min-h-[100px]">
             {block.url ? (
               <img src={block.url} alt={block.alt} className="w-full h-auto object-cover max-h-[400px]" />
             ) : (
               <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
             )}
             <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity">
               <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => updateBlock(block.id, { url: '', fileId: '' })}
                className="bg-brand-red hover:bg-brand-red/90 rounded-xl font-bold font-extrabold"
               >
                 <X className="w-4 h-4 mr-2" />
                 Entfernen
               </Button>
             </div>
           </div>
           <Input
            value={block.alt}
            onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
            placeholder="Alternativtext hinzufügen..."
            className="mt-2 text-xs font-medium text-muted-foreground border-none px-0 h-auto focus-visible:ring-0 text-center"
           />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-brand-sky hover:bg-brand-sky/5 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-brand-sky/10 flex items-center justify-center text-brand-sky group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-brand-navy">Bild hochladen</p>
              <p className="text-[10px] text-muted-foreground">JPG, PNG oder SVG (max. 10MB)</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-brand-sky hover:bg-brand-sky/5 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-brand-sky/10 flex items-center justify-center text-brand-sky group-hover:scale-110 transition-transform">
              <Grid className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-brand-navy">Mediathek öffnen</p>
              <p className="text-[10px] text-muted-foreground">Bereits hochgeladene Bilder wählen</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
