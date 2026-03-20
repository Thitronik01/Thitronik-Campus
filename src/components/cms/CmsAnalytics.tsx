'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Clock, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function AnalyticsBar({ label, value, color, delay }: { label: string, value: number, color: string, delay: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-brand-navy">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  )
}

export function CmsAnalytics() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight">Analytics & Reports</h2>
          <p className="text-muted-foreground font-medium">Überblick über Abschlussraten und Wissenszuwachs.</p>
        </div>
        <div className="bg-brand-navy/5 p-1 rounded-2xl flex gap-1">
          <Button variant="ghost" className="rounded-xl h-9 text-xs font-extrabold px-4">7 Tage</Button>
          <Button variant="ghost" className="rounded-xl h-9 text-xs font-extrabold px-4 bg-white shadow-sm">30 Tage</Button>
          <Button variant="ghost" className="rounded-xl h-9 text-xs font-extrabold px-4">Gesamt</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Placeholder */}
        <Card className="lg:col-span-2 p-8 rounded-[2.5rem] border-none bg-white shadow-sm space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-brand-navy">Engagement Trend</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-sky" />
                  <span className="text-xs font-bold text-muted-foreground">Logins</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-lime" />
                  <span className="text-xs font-bold text-muted-foreground">Abschlüsse</span>
                </div>
              </div>
           </div>
           
           <div className="h-64 w-full flex items-end gap-2 bg-muted/20 rounded-3xl p-6 relative group">
              {[60, 45, 80, 55, 90, 70, 85, 40, 65, 75, 50, 95].map((val, i) => (
                <div key={i} className="flex-1 h-full flex items-end justify-center relative">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="w-full max-w-[20px] bg-brand-sky/20 rounded-t-lg group-hover:bg-brand-sky/10 transition-all relative overflow-hidden"
                  >
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-brand-sky/40" />
                  </motion.div>
                </div>
              ))}
              <div className="absolute inset-x-6 top-1/2 h-px bg-border/50 border-dashed" />
           </div>
           
           <div className="grid grid-cols-3 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Growth</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-brand-navy">+24%</span>
                  <ArrowUpRight className="w-5 h-5 text-brand-lime" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Active Seats</p>
                <span className="text-2xl font-extrabold text-brand-navy">1.242</span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Lernstunden</p>
                <span className="text-2xl font-extrabold text-brand-navy">4.8k</span>
              </div>
           </div>
        </Card>

        {/* Module Performance */}
        <Card className="p-8 rounded-[2.5rem] border-none bg-white shadow-sm space-y-6">
           <h3 className="text-xl font-bold text-brand-navy">Module Performance</h3>
           <div className="space-y-6">
              <AnalyticsBar label="WiPro III Grundlagen" value={92} color="bg-brand-lime" delay={0.1} />
              <AnalyticsBar label="Pro-finder Installation" value={78} color="bg-brand-sky" delay={0.2} />
              <AnalyticsBar label="G.A.S.-pro III Support" value={64} color="bg-violet-500" delay={0.3} />
              <AnalyticsBar label="Networking Expert" value={45} color="bg-brand-red" delay={0.4} />
              <AnalyticsBar label="Technischer Vertrieb" value={88} color="bg-brand-navy" delay={0.5} />
           </div>
           
           <div className="pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Der Kurs **„G.A.S.-pro III Support“** weist eine Abbruchrate von 15% bei Lektion 4 auf. Überprüfung der Inhalte empfohlen.
              </p>
              <Button variant="outline" className="w-full mt-4 rounded-xl border-brand-navy text-brand-navy font-bold h-9">Detaillierter Bericht</Button>
           </div>
        </Card>
      </div>
    </div>
  )
}
