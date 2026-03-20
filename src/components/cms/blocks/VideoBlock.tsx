'use client'

import React from 'react'
import { VideoBlock as VideoBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Video, Link as LinkIcon, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoBlockProps {
  block: VideoBlockType
}

export function VideoBlock({ block }: VideoBlockProps) {
  const { updateBlock } = useCmsStore()

  return (
    <div className="space-y-4">
      {block.url || block.fileId ? (
        <div className="relative group/video">
           <div className="aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-border">
             <Video className="w-12 h-12 text-white/20" />
             <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/video:opacity-100 transition-opacity">
               <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => updateBlock(block.id, { url: '', fileId: '' })}
                className="bg-brand-red hover:bg-brand-red/90 rounded-xl font-bold"
               >
                 <X className="w-4 h-4 mr-2" />
                 Entfernen
               </Button>
             </div>
           </div>
           <Input
            value={block.caption}
            onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
            placeholder="Bildunterschrift / Titel hinzufügen..."
            className="mt-2 text-xs font-medium text-muted-foreground border-none px-0 h-auto focus-visible:ring-0 text-center"
           />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-brand-sky hover:bg-brand-sky/5 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-brand-sky/10 flex items-center justify-center text-brand-sky group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-brand-navy">Video hochladen</p>
              <p className="text-[10px] text-muted-foreground">MP4, MOV oder WEBM (max. 100MB)</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-brand-sky hover:bg-brand-sky/5 transition-all group">
            <div className="w-10 h-10 rounded-full bg-brand-sky/10 flex items-center justify-center text-brand-sky group-hover:scale-110 transition-transform">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div className="w-full space-y-2">
               <p className="text-sm font-bold text-center text-brand-navy">Video-Link einbetten</p>
               <div className="flex gap-2">
                 <Input 
                   placeholder="YouTube oder Vimeo URL..." 
                   className="h-8 text-xs rounded-lg border-border focus-visible:ring-brand-sky"
                   onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                       updateBlock(block.id, { url: (e.target as HTMLInputElement).value })
                     }
                   }}
                 />
                 <Button 
                  size="sm" 
                  className="h-8 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-[10px] font-bold"
                  onClick={(e) => {
                    const input = (e.currentTarget.previousSibling as HTMLInputElement)
                    if (input.value) updateBlock(block.id, { url: input.value })
                  }}
                 >
                   Einbetten
                 </Button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
