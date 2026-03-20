'use client'

import { useTranslations } from 'next-intl'
import { 
  Send, 
  Save, 
  Eye, 
  Settings, 
  Image as ImageIcon, 
  History,
  CheckCircle2,
  Clock,
  User as UserIcon,
  ChevronRight
} from 'lucide-react'
import { useCmsStore } from '@/store/cmsStore'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function PublishSidebar() {
  const t = useTranslations('cms')
  const { 
    status, 
    blocks, 
    lastSaved, 
    version, 
    saveDraft, 
    publish, 
    setPreviewMode, 
    islandMetadata, 
    updateMetadata 
  } = useCmsStore()

  return (
    <aside className="w-[280px] flex-shrink-0 border-l border-border bg-muted/20 flex flex-col h-full overflow-y-auto thin-scrollbar bg-[#f8f9fa]">
      <div className="p-4 space-y-6 pb-20">
        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button 
            onClick={publish}
            className="w-full bg-brand-lime text-brand-navy font-extrabold hover:bg-brand-lime/90 h-11 rounded-2xl shadow-lg shadow-brand-lime/20 group"
          >
            <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            {t('publish.btn')}
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={saveDraft}
              className="border-brand-navy text-brand-navy font-bold hover:bg-brand-navy/5 rounded-xl h-10"
            >
              <Save className="w-4 h-4 mr-2" />
              {t('publish.draft')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setPreviewMode(true)}
              className="border-brand-sky text-brand-sky font-bold hover:bg-brand-sky/5 rounded-xl h-10"
            >
              <Eye className="w-4 h-4 mr-2" />
              {t('publish.preview')}
            </Button>
          </div>
        </div>

        {/* ... (Status Card stays the same) ... */}
        {/* Status Card */}
        <Card className="p-4 rounded-3xl border-border bg-white shadow-[var(--shadow-card)] space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-sky" />
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand-navy">{t('status.version')} {version}.0</h3>
            <Badge className={cn(
              "rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              status === 'published' ? "bg-brand-lime/20 text-brand-navy" : "bg-amber-100 text-amber-700"
            )}>
              {status === 'published' ? t('status.published') : t('status.draft')}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-muted-foreground">{t('status.lastEdited')}</p>
                <p className="font-semibold">{lastSaved ? lastSaved.toLocaleTimeString() : '---'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <UserIcon className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-muted-foreground">{t('status.editor')}</p>
                <p className="font-semibold text-brand-navy">Max Behrens</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-muted-foreground">{t('status.blockCount')}</p>
                <p className="font-semibold">{blocks.length} Blöcke</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Island Details (Enhanced from metadata) */}
        <div className="space-y-3">
           <h3 className="text-xs font-bold text-brand-navy uppercase tracking-widest pl-2">
            Insel-Details
          </h3>
          <Card className="rounded-3xl border-border bg-white p-4 space-y-4">
             <div className="space-y-2">
               <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Schwierigkeit</Label>
               <select 
                 value={islandMetadata.difficulty}
                 onChange={(e) => updateMetadata({ difficulty: e.target.value as any })}
                 className="w-full bg-muted/50 border-none rounded-xl text-xs font-bold p-2 focus:ring-1 focus:ring-brand-sky outline-none h-9"
               >
                 <option value="Basis">Basis</option>
                 <option value="Fortgeschritten">Fortgeschritten</option>
                 <option value="Profi">Profi</option>
               </select>
             </div>
             <div className="space-y-2">
               <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Zielgruppe</Label>
               <input 
                 value={islandMetadata.audience}
                 onChange={(e) => updateMetadata({ audience: e.target.value })}
                 className="w-full bg-muted/50 border-none rounded-xl text-xs font-bold p-2 focus:ring-1 focus:ring-brand-sky outline-none h-9"
                 placeholder="Händler, Support..."
               />
             </div>
             <div className="space-y-2">
               <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Dauer</Label>
               <input 
                 value={islandMetadata.duration}
                 onChange={(e) => updateMetadata({ duration: e.target.value })}
                 className="w-full bg-muted/50 border-none rounded-xl text-xs font-bold p-2 focus:ring-1 focus:ring-brand-sky outline-none h-9"
                 placeholder="z.B. 45 min"
               />
             </div>
          </Card>
        </div>

        {/* Island Settings */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-brand-navy uppercase tracking-widest pl-2">
            {t('islandSettings.title')}
          </h3>
          <Card className="rounded-3xl border-border bg-white p-4 space-y-4">
             <div className="flex items-center justify-between group cursor-pointer">
              <Label className="text-sm font-medium cursor-pointer">{t('islandSettings.xp')}</Label>
              <Badge variant="outline" className="rounded-lg border-brand-sky text-brand-sky font-bold">500 XP</Badge>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-muted">
              <Label htmlFor="island-active" className="text-sm font-medium cursor-pointer">{t('islandSettings.active')}</Label>
              <Switch id="island-active" defaultChecked className="data-[state=checked]:bg-brand-lime" />
            </div>
          </Card>
        </div>

        {/* Media Library Grid Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold text-brand-navy uppercase tracking-widest">
              {t('media.title')}
            </h3>
            <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold text-brand-sky hover:text-brand-sky hover:bg-brand-sky/5 p-1 px-2 rounded-lg">
              {t('media.upload')}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
             {[1,2,3,4].map(i => (
               <div key={i} className="aspect-square bg-muted rounded-2xl flex items-center justify-center border border-border/50 hover:border-brand-sky transition-colors cursor-pointer group relative overflow-hidden">
                 <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                 <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/5 transition-colors" />
               </div>
             ))}
          </div>
        </div>

        {/* Version History Preview */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-brand-navy uppercase tracking-widest pl-2">
            {t('history.title')}
          </h3>
          <div className="space-y-3 px-2">
            {[
              { v: '2.0', status: 'live', date: 'Heute, 09:15', user: 'MB' },
              { v: '1.9', status: 'draft', date: 'Gestern, 14:20', user: 'JS' },
              { v: '1.8', status: 'published', date: '15. Mär, 11:05', user: 'MB' }
            ].map((item, i) => (
              <div key={i} className="flex gap-3 relative pb-2 group cursor-pointer">
                {i !== 2 && <div className="absolute left-1.5 top-3 bottom-0 w-0.5 bg-border rounded-full" />}
                <div className={cn(
                  "w-3 h-3 rounded-full mt-1.5 z-10",
                  item.status === 'live' ? "bg-brand-lime ring-4 ring-brand-lime/20" : 
                  item.status === 'draft' ? "bg-amber-400" : "bg-slate-300"
                )} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-brand-navy">v{item.v}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{item.date}</p>
                  </div>
                   <p className="text-[10px] font-semibold text-brand-sky mt-0.5">{item.user} • {item.status.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </aside>
  )
}
