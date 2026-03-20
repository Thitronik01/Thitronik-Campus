'use client'

import React from 'react'
import { ToolEmbedBlock as ToolEmbedBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Wrench, Map, Monitor, PenTool } from 'lucide-react'

interface ToolEmbedBlockProps {
  block: ToolEmbedBlockType
}

const AVAILABLE_TOOLS = [
  { id: 'whiteboard', name: 'Digitales Whiteboard', icon: PenTool, description: 'Interaktives Board für Notizen und Skizzen.' },
  { id: 'lageplan', name: 'Interaktiver Lageplan', icon: Map, description: 'Campus-Map mit Hotspots und Infos.' },
  { id: 'konfigurator', name: 'Safe.lock Konfigurator', icon: Monitor, description: 'Produktauswahl basierend auf Fahrzeugtyp.' },
  { id: 'working-card', name: 'Digitale Arbeitskarte', icon: Wrench, description: 'Prüfprotokolle und technische Dokumentation.' },
]

export function ToolEmbedBlock({ block }: ToolEmbedBlockProps) {
  const { updateBlock } = useCmsStore()

  const selectedTool = AVAILABLE_TOOLS.find(t => t.id === block.toolId)
  const ToolIcon = selectedTool?.icon || Wrench

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Wrench className="w-5 h-5 text-red-600" />
        <p className="text-sm font-bold text-brand-navy uppercase tracking-wider">Werkzeug / Tool einbetten</p>
      </div>

      <Select 
        value={block.toolId} 
        onValueChange={(val) => {
          const tool = AVAILABLE_TOOLS.find(t => t.id === val)
          updateBlock(block.id, { toolId: val, title: tool?.name || '' })
        }}
      >
        <SelectTrigger className="w-full h-12 rounded-2xl border-border bg-white hover:bg-muted/50 transition-colors focus:ring-brand-sky">
          <SelectValue placeholder="Wähle ein Werkzeug aus..." />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-border shadow-[var(--shadow-dropdown)]">
          {AVAILABLE_TOOLS.map((tool) => (
            <SelectItem key={tool.id} value={tool.id} className="rounded-xl focus:bg-brand-sky/10 focus:text-brand-navy cursor-pointer py-3">
              <div className="flex items-center gap-3">
                <tool.icon className="w-5 h-5 text-brand-navy opacity-70" />
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{tool.name}</span>
                  <span className="text-[10px] text-muted-foreground">{tool.description}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedTool && (
        <div className="p-5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-4 animate-fade-in group hover:bg-red-100/50 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-white border border-red-200 flex items-center justify-center text-red-600 shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform">
            <ToolIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
             <h4 className="text-sm font-bold text-red-900">{selectedTool.name}</h4>
             <p className="text-xs text-red-800/80 leading-relaxed font-medium">{selectedTool.description}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-red-400 group-hover:bg-white group-hover:text-red-500 transition-all">
             <Monitor className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  )
}
