'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Users, Star, ArrowLeft } from 'lucide-react'
import { useCmsStore } from '@/store/cmsStore'
import { BlockStack } from './BlockStack'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LearnerPreview() {
  const { blocks, islandMetadata, setPreviewMode, activeIslandId } = useCmsStore()

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white overflow-y-auto thin-scrollbar pb-32"
    >
      {/* Top Header/Navigation Placeholder */}
      <div className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xl">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setPreviewMode(false)}
            className="text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Editor verlassen
          </Button>
          <div className="h-6 w-[1px] bg-white/20 mx-2" />
          <h2 className="font-bold tracking-tight">Vorschau: {activeIslandId ? activeIslandId.toUpperCase() : 'Lernmodul'}</h2>
        </div>
        <Badge className="bg-brand-lime text-brand-navy font-bold">VORSCHAU-MODUS</Badge>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-12">
        {/* Island Hero Intro (from Metadata) */}
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-brand-sky/10 text-brand-sky border-none px-3 py-1 rounded-lg font-bold">
              {islandMetadata.difficulty}
            </Badge>
            {islandMetadata.tags.map(tag => (
              <Badge key={tag} variant="outline" className="border-border text-muted-foreground px-3 py-1 rounded-lg">
                {tag}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy leading-tight">
            {activeIslandId ? `Insel ${activeIslandId.charAt(0).toUpperCase() + activeIslandId.slice(1)}` : 'Übersicht'}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
              <Clock className="w-5 h-5 text-brand-sky" />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">DAUER</p>
                <p className="font-bold text-brand-navy">{islandMetadata.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
              <Users className="w-5 h-5 text-brand-sky" />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">ZIELGRUPPE</p>
                <p className="font-bold text-brand-navy">{islandMetadata.audience}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
              <Star className="w-5 h-5 text-brand-sky" />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">BEWERTUNG</p>
                <p className="font-bold text-brand-navy">4.8/5</p>
              </div>
            </div>
          </div>

          {islandMetadata.summary && (
            <p className="text-lg text-brand-ink leading-relaxed">
              {islandMetadata.summary}
            </p>
          )}
        </div>

        {/* Content Blocks (Simplified rendering - no handles, no shadows/border in preview) */}
        <div className="space-y-8">
           <BlockStack isReadOnly />
        </div>

        {/* Facts List (from Metadata) */}
        {islandMetadata.facts.length > 0 && (
           <div className="space-y-4 p-8 rounded-[2.5rem] bg-brand-navy text-white shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-sky/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <h3 className="text-2xl font-bold relative z-10">Wichtige Fakten & Takeaways</h3>
              <div className="grid gap-4 relative z-10">
                {islandMetadata.facts.map((fact, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="h-6 w-6 rounded-full bg-brand-lime text-brand-navy flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-white/90 leading-relaxed font-medium">{fact}</p>
                  </div>
                ))}
              </div>
           </div>
        )}
      </div>

      {/* Floating Close Button */}
      <Button 
        onClick={() => setPreviewMode(false)}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-brand-navy text-white shadow-3xl hover:bg-brand-sky hover:scale-110 transition-all z-[110]"
      >
        <X className="w-8 h-8" />
      </Button>
    </motion.div>
  )
}
