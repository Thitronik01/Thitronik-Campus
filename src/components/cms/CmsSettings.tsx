'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Settings, Shield, User, Globe, Mail, Save } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function CmsSettings() {
  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight">Einstellungen</h2>
          <p className="text-muted-foreground font-medium">Verwalte CMS-Präferenzen, API-Keys und Rollen.</p>
        </div>
        <Button className="rounded-2xl bg-brand-sky text-white font-bold h-11 px-8 hover:bg-brand-sky/90 shadow-lg shadow-brand-sky/20">
          <Save className="w-5 h-5 mr-2" />
          Speichern
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Col: Menu */}
        <div className="md:col-span-1 space-y-4">
           {[
             { label: 'Allgemein', icon: Settings, active: true },
             { label: 'Sicherheit', icon: Shield, active: false },
             { label: 'Team & Rollen', icon: User, active: false },
             { label: 'Lokalisierung', icon: Globe, active: false },
             { label: 'Benachrichtigungen', icon: Mail, active: false },
           ].map((item, i) => (
             <button 
               key={i}
               className={cn(
                 "w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all text-sm",
                 item.active ? "bg-white text-brand-navy shadow-sm" : "text-muted-foreground hover:bg-white/50"
               )}
             >
               <item.icon className={cn("w-5 h-5", item.active ? "text-brand-sky" : "text-muted-foreground")} />
               {item.label}
             </button>
           ))}
        </div>

        {/* Right Col: Form */}
        <div className="md:col-span-2 space-y-8">
           <Card className="p-8 rounded-[2.5rem] border-none bg-white shadow-sm space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-extrabold text-brand-navy uppercase tracking-widest pl-1">Projekt Name</Label>
                  <Input defaultValue="Thitronik Academy 2026" className="rounded-xl border-muted bg-muted/20 h-11 focus-visible:bg-white" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-extrabold text-brand-navy uppercase tracking-widest pl-1">Support Email</Label>
                  <Input defaultValue="academy@thitronik.de" className="rounded-xl border-muted bg-muted/20 h-11 focus-visible:bg-white" />
                </div>
                
                <div className="pt-4 space-y-4 border-t border-border">
                   <div className="flex items-center justify-between">
                     <div className="space-y-1">
                       <p className="font-bold text-brand-navy">Auto-Publish</p>
                       <p className="text-xs text-muted-foreground">Änderungen werden sofort live geschaltet.</p>
                     </div>
                     <Switch />
                   </div>
                   <div className="flex items-center justify-between">
                     <div className="space-y-1">
                       <p className="font-bold text-brand-navy">Revisions-Historie</p>
                       <p className="text-xs text-muted-foreground">Speichert alle Versionen der letzten 90 Tage.</p>
                     </div>
                     <Switch defaultChecked />
                   </div>
                   <div className="flex items-center justify-between">
                     <div className="space-y-1">
                       <p className="font-bold text-brand-navy">KI-Vorschläge</p>
                       <p className="text-xs text-muted-foreground">Aktiviert intelligente Inhalts-Tipps im Editor.</p>
                     </div>
                     <Switch defaultChecked />
                   </div>
                </div>
              </div>
           </Card>

           <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-red-200 bg-red-50/20 space-y-4">
              <h4 className="font-bold text-red-600">Gefahrenbereich</h4>
              <p className="text-xs text-muted-foreground font-medium">Das Löschen des CMS-Projekts kann nicht rückgängig gemacht werden. Alle Module und Lernpfade gehen verloren.</p>
              <Button variant="destructive" className="rounded-xl h-10 font-bold px-6">Projekt löschen</Button>
           </div>
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
