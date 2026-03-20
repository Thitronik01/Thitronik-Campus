'use client'

import { useTranslations } from 'next-intl'
import { 
  Type, 
  Heading, 
  Video, 
  Image as ImageIcon, 
  FileText, 
  Gamepad2, 
  Wrench, 
  HelpCircle, 
  ListChecks, 
  MessageSquare, 
  Columns, 
  Layers, 
  LayoutGrid, 
  Minus,
  Plus
} from 'lucide-react'
import { useCmsStore } from '@/store/cmsStore'
import { CMSBlockType } from '@/lib/cms/types'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const BLOCK_TYPES: { type: CMSBlockType; icon: any; color: string }[] = [
  { type: 'heading', icon: Heading, color: 'text-violet-600' },
  { type: 'text', icon: Type, color: 'text-blue-600' },
  { type: 'video', icon: Video, color: 'text-pink-600' },
  { type: 'image', icon: ImageIcon, color: 'text-green-600' },
  { type: 'presentation', icon: FileText, color: 'text-orange-600' },
  { type: 'game', icon: Gamepad2, color: 'text-amber-600' },
  { type: 'tool', icon: Wrench, color: 'text-red-600' },
  { type: 'quiz', icon: HelpCircle, color: 'text-purple-600' },
  { type: 'checklist', icon: ListChecks, color: 'text-teal-600' },
  { type: 'faq', icon: MessageSquare, color: 'text-indigo-600' },
  { type: 'comparison', icon: Columns, color: 'text-cyan-600' },
  { type: 'steps', icon: Layers, color: 'text-emerald-600' },
  { type: 'cards', icon: LayoutGrid, color: 'text-blue-500' },
  { type: 'divider', icon: Minus, color: 'text-gray-500' },
]

export function BlockToolbar() {
  const t = useTranslations('cms.blocks')
  const { addBlock } = useCmsStore()

  return (
    <div className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-1.5 flex-wrap">
        <TooltipProvider delayDuration={0}>
          {BLOCK_TYPES.map(({ type, icon: Icon, color }) => (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addBlock(type)}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white border border-border/50 hover:border-brand-sky hover:shadow-lg hover:shadow-brand-sky/10 group",
                    color
                  )}
                >
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="rounded-lg bg-brand-navy text-white font-bold text-xs border-none">
                {t(type)}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      <div className="h-8 w-px bg-border mx-4" />

      <button className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-white rounded-xl text-sm font-bold hover:bg-brand-navy-light transition-colors shadow-lg shadow-brand-navy/20 whitespace-nowrap">
        <Plus className="w-4 h-4" />
        {t('add')}
      </button>
    </div>
  )
}
