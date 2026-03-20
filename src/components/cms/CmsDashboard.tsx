'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  CheckCircle2, 
  Users, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Flame, 
  Bell, 
  Bluetooth,
  TrendingUp,
  AlertCircle,
  Wand2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCmsStore } from '@/store/cmsStore'

function StatCard({ title, value, sub, icon: Icon, color }: { title: string, value: string, sub: string, icon: any, color: string }) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
            <h3 className="text-3xl font-extrabold text-brand-navy">{value}</h3>
            <p className="text-xs font-medium text-muted-foreground">{sub}</p>
          </div>
          <div className={`p-4 rounded-2xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CmsDashboard() {
  const { setCurrentView, setActiveIsland } = useCmsStore()
  
  const courses = [
    { id: 'vejroe', name: 'WiPro III', category: 'Alarmanlage', learners: 324, rating: 4.8, status: 'Live', icon: ShieldCheck, color: 'bg-brand-sky' },
    { id: 'pro-finder', name: 'Pro-finder', category: 'Ortung', learners: 189, rating: 4.6, status: 'Review', icon: MapPin, color: 'bg-violet-500' },
    { id: 'gas-pro', name: 'G.A.S.-pro III', category: 'Gaswarnung', learners: 278, rating: 4.9, status: 'Live', icon: Flame, color: 'bg-orange-500' },
    { id: 'tsa', name: 'T.S.A. Rauch', category: 'Rauchwarnung', learners: 211, rating: 4.7, status: 'Live', icon: Bell, color: 'bg-brand-red' },
  ]

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight">Management Dashboard</h2>
          <p className="text-muted-foreground font-medium">Verwalte die Lerninhalte und analysiere die Akademie-Performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl border-brand-navy text-brand-navy font-bold h-11 px-6">Export PDF</Button>
          <Button className="rounded-2xl bg-brand-navy text-white font-bold h-11 px-6 hover:bg-brand-navy/90">Neuer Kurs</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Kurse" value="12" sub="In 7 Inseln verteilt" icon={BookOpen} color="bg-brand-navy" />
        <StatCard title="Teilnehmer" value="1.428" sub="+12% im letzten Monat" icon={Users} color="bg-brand-sky" />
        <StatCard title="Completion" value="84%" sub="Ø aller Module" icon={TrendingUp} color="bg-brand-lime" />
        <StatCard title="Bewertung" value="4.8" sub="Sterne Ø" icon={Star} color="bg-amber-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Product Landscape */}
        <div className="xl:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
             <h3 className="text-xl font-bold text-brand-navy">Produktlandschaft</h3>
             <Button variant="ghost" className="text-brand-sky font-bold text-sm h-8">Alle ansehen</Button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map(course => (
                <button 
                  key={course.id}
                  onClick={() => {
                    setActiveIsland(course.id)
                    setCurrentView('content')
                  }}
                  className="flex items-center gap-4 p-5 rounded-[2rem] bg-white border-2 border-transparent hover:border-brand-sky/20 transition-all hover:shadow-xl hover:shadow-brand-navy/5 group text-left"
                >
                  <div className={`p-4 rounded-2xl ${course.color} text-white group-hover:scale-110 transition-transform`}>
                    <course.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold text-brand-navy">{course.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${course.status === 'Live' ? 'bg-brand-lime/20 text-brand-navy' : 'bg-amber-100 text-amber-700'}`}>
                        {course.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{course.category} • {course.learners} Lernende</p>
                  </div>
                </button>
              ))}
           </div>
        </div>

        {/* Editorial Priorities */}
        <div className="space-y-6">
           <h3 className="text-xl font-bold text-brand-navy">Prioritäten</h3>
           <div className="space-y-4">
              {[
                { title: 'WiPro Update', desc: 'Samsø Inhalte überarbeiten', priority: 'High', icon: AlertCircle, color: 'text-red-500' },
                { title: 'Neue Bilder', desc: 'Mediathek Synchronisation', priority: 'Med', icon: BookOpen, color: 'text-brand-sky' },
                { title: 'Feedback', desc: 'Usedom Review abschließen', priority: 'Low', icon: CheckCircle2, color: 'text-brand-lime' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-border flex items-center gap-4">
                  <div className={`p-2 rounded-xl bg-muted/50 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-brand-navy text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest">{item.priority}</Badge>
                </div>
              ))}
              
              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-brand-navy to-brand-navy-dark text-white space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-sky/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="relative z-10 space-y-4">
                   <div className="flex items-center gap-2">
                     <Wand2 className="w-5 h-5 text-brand-sky" />
                     <p className="text-xs font-bold uppercase tracking-widest text-brand-sky">KI-Vorschlag</p>
                   </div>
                   <p className="text-sm font-medium leading-relaxed">
                     Erstelle den Lernpfad **„Systemverkauf“** mit WiPro III, Pro-finder und G.A.S.-connect für eine höhere Engagement-Rate.
                   </p>
                   <Button className="w-full rounded-xl bg-brand-sky hover:bg-brand-sky/90 text-white font-bold h-10 border-none">
                     Vorschlag übernehmen
                   </Button>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function Badge({ children, className, variant = "default" }: any) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className} ${variant === 'outline' ? 'border border-border' : ''}`}>
      {children}
    </span>
  )
}
