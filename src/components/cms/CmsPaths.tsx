'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Route, Plus, MoreVertical, GripVertical, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function CmsPaths() {
  const paths = [
    { id: 'p1', name: 'Grundlagentraining WiPro III', modules: 5, time: '2.5h', learners: 142, status: 'Aktiv' },
    { id: 'p2', name: 'Fortgeschrittene Installation', modules: 3, time: '1.5h', learners: 89, status: 'Entwurf' },
    { id: 'p3', name: 'Service & Support Pro-finder', modules: 8, time: '4h', learners: 211, status: 'Aktiv' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight">Lernpfade</h2>
          <p className="text-muted-foreground font-medium">Bündle Module zu strukturierten Lernerfahrungen.</p>
        </div>
        <Button className="rounded-2xl bg-brand-navy text-white font-bold h-11 px-6 hover:bg-brand-navy/90">
          <Plus className="w-5 h-5 mr-2" />
          Neuer Lernpfad
        </Button>
      </div>

      <div className="grid gap-4">
        {paths.map((path) => (
          <Card key={path.id} className="p-6 rounded-[2.5rem] border-none bg-white shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-brand-sky opacity-20 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-6">
               <div className="h-14 w-14 rounded-2xl bg-brand-sky/10 flex items-center justify-center text-brand-sky">
                  <Route className="w-8 h-8" />
               </div>
               
               <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-extrabold text-brand-navy">{path.name}</h3>
                    <Badge variant="secondary" className={path.status === 'Aktiv' ? 'bg-brand-lime/20 text-brand-navy' : 'bg-muted'}>
                      {path.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                    <span>{path.modules} Module</span>
                    <span>•</span>
                    <span>{path.time} Dauer</span>
                    <span>•</span>
                    <span>{path.learners} Teilnehmer</span>
                  </div>
               </div>
               
               <div className="flex items-center gap-2 pr-4">
                  <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:bg-brand-sky/5 hover:text-brand-sky">
                    <CheckCircle2 className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:bg-muted">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
               </div>
            </div>
          </Card>
        ))}
        
        <button className="w-full flex items-center justify-center gap-3 p-8 border-2 border-dashed border-border rounded-[2.5rem] text-muted-foreground hover:border-brand-sky hover:text-brand-sky hover:bg-brand-sky/5 transition-all group">
            <div className="p-3 rounded-2xl bg-muted/50 group-hover:bg-brand-sky/10 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-extrabold">Weiteren Lernpfad anlegen</span>
        </button>
      </div>
    </div>
  )
}
