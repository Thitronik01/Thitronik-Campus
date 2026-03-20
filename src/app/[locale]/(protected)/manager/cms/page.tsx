'use client'

import React, { useEffect } from 'react'
import { CmsEditorShell } from '@/components/cms/CmsEditorShell'
import { BlockStack } from '@/components/cms/BlockStack'
import { useCmsStore } from '@/store/cmsStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Layout, PlusCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function CmsEditorPage() {
  const { blocks, activeIslandId, addBlock } = useCmsStore()

  // Initial redirect or state setup if needed
  useEffect(() => {
    // If no blocks, add a welcome heading
    if (blocks.length === 0) {
      addBlock('heading')
    }
  }, [blocks.length, addBlock])

  return (
    <CmsEditorShell>
      <div className="space-y-12">
        {/* Page Header Area */}
        <div className="flex items-center justify-between border-b border-border pb-6">
           <div className="space-y-1">
             <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-amber-100 text-amber-700 border-none text-[10px] font-bold px-2 py-0.5 rounded-lg">ENTWURF</Badge>
                <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy">
                  {activeIslandId ? `Insel: ${activeIslandId.charAt(0).toUpperCase() + activeIslandId.slice(1)}` : 'Inhalte bearbeiten'}
                </h2>
             </div>
             <p className="text-muted-foreground text-sm font-medium">Verwalte die Lerninhalte und interaktiven Module dieser Insel.</p>
           </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {blocks.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <BlockStack />
              
              {/* Bottom Add Button */}
              <div className="mt-12 flex justify-center pb-20">
                <button
                  onClick={() => addBlock('text')}
                  className="group flex flex-col items-center gap-3 p-8 border-2 border-dashed border-border rounded-[2.5rem] hover:border-brand-sky hover:bg-brand-sky/5 transition-all w-full max-w-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-sky/10 flex items-center justify-center text-brand-sky group-hover:scale-110 group-hover:bg-brand-sky group-hover:text-white transition-all">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-brand-navy">Nächsten Block hinzufügen</p>
                    <p className="text-xs text-muted-foreground font-medium">Wähle einen Typ aus der Toolbar oder klicke hier.</p>
                  </div>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 space-y-6"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-brand-navy/5 flex items-center justify-center text-brand-navy/20">
                <Layout className="w-10 h-10" />
              </div>
              <p className="text-muted-foreground font-medium italic">Noch keine Inhalte vorhanden. Beginne mit einem Block aus der Toolbar.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CmsEditorShell>
  )
}

