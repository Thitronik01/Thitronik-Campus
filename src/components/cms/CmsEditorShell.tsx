'use client'

import { useTranslations } from 'next-intl'
import { Command, Bell, User, Layout, Save } from 'lucide-react'
import { useCmsStore } from '@/store/cmsStore'
import { IslandSidebar } from './IslandSidebar'
import { PublishSidebar } from './PublishSidebar'
import { BlockToolbar } from './BlockToolbar'
import { LearnerPreview } from './LearnerPreview'
import { CmsDashboard } from './CmsDashboard'
import { CmsPaths } from './CmsPaths'
import { CmsAnalytics } from './CmsAnalytics'
import { CmsSettings } from './CmsSettings'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { AnimatePresence, motion } from 'framer-motion'

interface CmsEditorShellProps {
  children: React.ReactNode
}

function TopBar() {
  const t = useTranslations('cms')
  const { isDirty, lastSaved } = useCmsStore()
  
  return (
    <header className="h-16 w-full bg-gradient-to-r from-brand-navy to-brand-navy-dark border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-30 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="bg-white/10 p-2 rounded-xl">
          <Layout className="w-5 h-5 text-brand-sky" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-white text-lg font-extrabold tracking-tight leading-none leading-tight">
            Campus <span className="text-brand-sky">CMS</span>
          </h1>
          <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Content Management System</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
           <Badge variant="outline" className={cn(
             "h-7 rounded-full px-3 border-white/20 text-white font-medium text-[10px] flex items-center gap-2",
             isDirty ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-brand-lime/10 text-brand-lime border-brand-lime/20"
           )}>
             {isDirty ? (
               <><Save className="w-3 h-3 animate-pulse" /> {t('saving')}</>
             ) : (
               <>{t('autosave', { minutes: 2 })}</>
             )}
           </Badge>
        </div>

        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <button className="text-white/60 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-red rounded-full" />
          </button>
          <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors p-1.5 pr-3 rounded-full group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-brand-sky flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
              MB
            </div>
            <span className="text-sm font-bold text-white transition-colors">Max Behrens</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export function CmsEditorShell({ children }: CmsEditorShellProps) {
  const { isPreviewMode, currentView } = useCmsStore()

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background relative">
      <AnimatePresence>
        {isPreviewMode && <LearnerPreview />}
      </AnimatePresence>
      
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <IslandSidebar />
        
        <main className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] relative">
          {currentView === 'content' && <BlockToolbar />}
          
          <div className="flex-1 overflow-y-auto thin-scrollbar p-12 pt-8 pb-32">
            <div className="max-w-[1200px] mx-auto">
              <AnimatePresence mode="wait">
                {currentView === 'dashboard' ? (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <CmsDashboard />
                  </motion.div>
                ) : currentView === 'paths' ? (
                  <motion.div
                    key="paths"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <CmsPaths />
                  </motion.div>
                ) : currentView === 'analytics' ? (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <CmsAnalytics />
                  </motion.div>
                ) : currentView === 'settings' ? (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <CmsSettings />
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-[800px] mx-auto"
                  >
                    {children}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {currentView === 'content' && (
            <motion.div 
              initial={{ x: 280 }}
              animate={{ x: 0 }}
              exit={{ x: 280 }}
              className="border-l border-border"
            >
              <PublishSidebar />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
