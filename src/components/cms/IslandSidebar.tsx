import { useTranslations } from 'next-intl'
import { 
  Plus, 
  Search, 
  MapPin, 
  LayoutDashboard, 
  BookOpen, 
  Route, 
  BarChart3, 
  Settings 
} from 'lucide-react'
import { useCmsStore } from '@/store/cmsStore'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'content', label: 'Content (Editor)', icon: BookOpen },
  { id: 'paths', label: 'Lernpfade', icon: Route },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Einstellungen', icon: Settings },
] as const

const ISLANDS = [
  { id: 'vejroe', name: 'Vejrø', emoji: '⚓', type: 'Modul A', xp: 500, state: 'published' },
  { id: 'poel', name: 'Poel', emoji: '🗂️', type: 'Modul B', xp: 350, state: 'draft' },
  { id: 'hiddensee', name: 'Hiddensee', emoji: '🔧', type: 'Modul C', xp: 450, state: 'published' },
  { id: 'samsoe', name: 'Samsø', emoji: '🚐', type: 'Modul D', xp: 600, state: 'published' },
  { id: 'langeland', name: 'Langeland', emoji: '🤝', type: 'Modul E', xp: 300, state: 'draft' },
  { id: 'usedom', name: 'Usedom', emoji: '💼', type: 'Modul F', xp: 550, state: 'published' },
  { id: 'fehmarn', name: 'Fehmarn', emoji: '🛠️', type: 'Modul G', xp: 400, state: 'published' },
]

export function IslandSidebar() {
  const t = useTranslations('cms.sidebar')
  const { activeIslandId, setActiveIsland, currentView, setCurrentView } = useCmsStore()

  return (
    <aside className="w-[230px] flex-shrink-0 border-r border-border bg-white flex flex-col h-full bg-[#fcfcfc] overflow-hidden">
      {/* Main Nav */}
      <div className="p-3 space-y-1 border-b border-border/50">
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-3 mb-2">Management</p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-bold text-xs",
              currentView === item.id 
                ? "bg-brand-navy text-white shadow-lg shadow-brand-navy/10" 
                : "hover:bg-brand-sky/5 text-brand-navy/70"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      <div className={cn(
        "flex-1 flex flex-col transition-opacity duration-300",
        currentView !== 'content' ? "opacity-30 pointer-events-none grayscale" : "opacity-100"
      )}>
        <div className="p-4 space-y-4">
          <h2 className="text-xs font-bold text-brand-navy uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-sky" />
            Inseln
          </h2>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder={t('search')} 
              className="pl-9 bg-muted/30 border-none rounded-xl text-[11px] h-9 focus-visible:ring-brand-sky focus-visible:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scrollbar px-2 space-y-1 py-2">
        {ISLANDS.map((island) => (
          <motion.button
            key={island.id}
            whileHover={{ x: 4 }}
            onClick={() => setActiveIsland(island.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 group text-left",
              activeIslandId === island.id 
                ? "bg-brand-navy text-white shadow-lg shadow-brand-navy/10" 
                : "hover:bg-brand-sky/5 text-brand-ink"
            )}
          >
            <span className="text-xl leading-none">{island.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={cn(
                  "font-bold truncate text-sm",
                  activeIslandId === island.id ? "text-white" : "text-brand-navy"
                )}>
                  {island.name}
                </p>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  island.state === 'published' ? "bg-brand-lime" : "bg-amber-400"
                )} />
              </div>
              <p className={cn(
                "text-[10px] uppercase tracking-wider font-semibold opacity-70",
                activeIslandId === island.id ? "text-white/80" : "text-muted-foreground"
              )}>
                {island.type} • {island.xp} XP
              </p>
            </div>
          </motion.button>
        ))}

        <button className="w-full mt-4 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:border-brand-sky hover:text-brand-sky hover:bg-brand-sky/5 transition-all text-xs font-bold group">
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          {t('newIsland')}
        </button>
      </div>
    </aside>
  )
}
