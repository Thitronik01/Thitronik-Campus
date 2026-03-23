"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, Square, RotateCcw, Flag, Timer, Settings2, Copy, Trash2, Award, Calculator, Plus, Minus } from "lucide-react"

// --- Types & Interfaces ---
interface Lap {
  lapTime: number
  totalTime: number
  delta: number
}

interface Participant {
  id: string
  name: string
  isRunning: boolean
  elapsedMs: number
  isFinished: boolean
  startTime: number | null
}

interface HistoryEntry {
  id: string
  date: string
  label: string
  timeMs: number
  participant?: string
}

// --- Helper Functions ---
const formatTime = (ms: number, showMs = true) => {
  if (ms < 0) ms = 0
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const milliseconds = Math.floor((ms % 1000) / 10)
  
  const mm = minutes.toString().padStart(2, "0")
  const ss = seconds.toString().padStart(2, "0")
  const msStr = milliseconds.toString().padStart(2, "0")
  
  if (showMs) return `${mm}:${ss}.${msStr}`
  return `${mm}:${ss}`
}

const parseInputToMs = (input: string): number => {
  // expects MM:SS
  const parts = input.split(":")
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10) || 0
    const secs = parseInt(parts[1], 10) || 0
    return (mins * 60 + secs) * 1000
  }
  return parseInt(input, 10) * 1000 || 0
}

export default function EinbauStoppuhr() {
  const [mode, setMode] = useState<"single" | "multi">("single")
  const [isCountdown, setIsCountdown] = useState(false)
  const [countdownTargetInput, setCountdownTargetInput] = useState("15:00")
  const [countdownTarget, setCountdownTarget] = useState(900000) // 15 mins default
  
  // Configurator state
  const [showConfigurator, setShowConfigurator] = useState(false)
  const [config, setConfig] = useState({
     zentrale: "wipro" as "wipro" | "cas" | "none",
     profinder: true,
     magnetKontakte: 4,
     kabelschleife: true,
     rauchmelder: true
  })

  const calcConfigTime = () => {
      let mins = 0
      if (config.zentrale === "wipro") mins += 30
      if (config.zentrale === "cas") mins += 45
      if (config.profinder) mins += 20
      mins += config.magnetKontakte * 5
      if (config.kabelschleife) mins += 10
      if (config.rauchmelder) mins += 10
      return mins
  }
  
  // Single mode state
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [laps, setLaps] = useState<Lap[]>([])
  const [isFinished, setIsFinished] = useState(false)
  
  // Multi mode state
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "1", name: "Team 1", isRunning: false, elapsedMs: 0, isFinished: false, startTime: null },
    { id: "2", name: "Team 2", isRunning: false, elapsedMs: 0, isFinished: false, startTime: null },
  ])
  
  // History state
  const [history, setHistory] = useState<HistoryEntry[]>([])
  
  // Refs for animation frames and timing
  const singleStartRef = useRef<number | null>(null)
  const singleRafRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("einbau-stoppuhr-history")
      if (saved) setHistory(JSON.parse(saved))
    } catch {}
    
    audioRef.current = new Audio("/sounds/buzzer.mp3")
  }, [])

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem("einbau-stoppuhr-history", JSON.stringify(history))
    } catch {}
  }, [history])

  // --- Single Mode Logic ---
  const updateSingleTimer = useCallback(() => {
    if (!singleStartRef.current) return
    const now = performance.now()
    setElapsedMs(prev => {
       const newElapsed = prev + (now - singleStartRef.current!)
       singleStartRef.current = now
       
       if (isCountdown && countdownTarget - newElapsed <= 0) {
          setIsRunning(false)
          setIsFinished(true)
          if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {})
          }
          if (singleRafRef.current) cancelAnimationFrame(singleRafRef.current)
          return countdownTarget
       }
       
       return newElapsed
    })
    singleRafRef.current = requestAnimationFrame(updateSingleTimer)
  }, [isCountdown, countdownTarget])

  useEffect(() => {
    if (isRunning) {
      singleStartRef.current = performance.now()
      singleRafRef.current = requestAnimationFrame(updateSingleTimer)
    } else {
      if (singleRafRef.current) cancelAnimationFrame(singleRafRef.current)
    }
    return () => {
      if (singleRafRef.current) cancelAnimationFrame(singleRafRef.current)
    }
  }, [isRunning, updateSingleTimer])

  const handleStartPause = () => {
    if (isFinished) return
    if (isCountdown && elapsedMs >= countdownTarget) return
    setIsRunning(!isRunning)
  }

  const handleStop = () => {
    setIsRunning(false)
    setIsFinished(true)
    // Optional: Auto-save to history on stop
    if (elapsedMs > 0) {
       saveToHistory(isCountdown ? "Countdown" : "Stoppuhr", isCountdown ? countdownTarget - elapsedMs : elapsedMs)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsFinished(false)
    setElapsedMs(0)
    setLaps([])
    singleStartRef.current = null
  }

  const handleLap = () => {
    if (!isRunning || isCountdown) return
    const lastTotal = laps.length > 0 ? laps[0].totalTime : 0
    const lapTime = elapsedMs - lastTotal
    const delta = laps.length > 0 ? lapTime - laps[0].lapTime : 0
    
    setLaps((prev) => [{ lapTime, totalTime: elapsedMs, delta }, ...prev])
  }

  // --- Multi Mode Logic ---
  const multiRafRef = useRef<number | null>(null)
  
  const updateMultiTimers = useCallback(() => {
    const now = performance.now()
    setParticipants((prev) => {
      let changed = false
      const updated = prev.map(p => {
        if (p.isRunning && p.startTime) {
          changed = true
          return { ...p, elapsedMs: p.elapsedMs + (now - p.startTime), startTime: now }
        }
        return p
      })
      return changed ? updated : prev
    })
    multiRafRef.current = requestAnimationFrame(updateMultiTimers)
  }, [])

  useEffect(() => {
    const anyRunning = participants.some(p => p.isRunning)
    if (anyRunning) {
       multiRafRef.current = requestAnimationFrame(updateMultiTimers)
    } else {
       if (multiRafRef.current) cancelAnimationFrame(multiRafRef.current)
    }
    return () => {
      if (multiRafRef.current) cancelAnimationFrame(multiRafRef.current)
    }
  }, [participants, updateMultiTimers])

  const toggleParticipantTimer = (id: string) => {
    const now = performance.now()
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
         return { ...p, isRunning: !p.isRunning, startTime: !p.isRunning ? now : null }
      }
      return p
    }))
  }

  const stopParticipantTimer = (id: string, name: string) => {
    setParticipants(prev => {
       const p = prev.find(x => x.id === id)
       if (p && p.elapsedMs > 0) {
          saveToHistory(`Team: ${name}`, p.elapsedMs, name)
       }
       return prev.map(p => {
          if (p.id === id) {
             return { ...p, isRunning: false, isFinished: true, startTime: null }
          }
          return p
       })
    })
  }

  const addParticipant = () => {
    if (participants.length >= 6) return
    setParticipants(prev => [...prev, {
       id: Date.now().toString(),
       name: `Team ${prev.length + 1}`,
       isRunning: false,
       elapsedMs: 0,
       isFinished: false,
       startTime: null
    }])
  }

  const removeParticipant = (id: string) => {
     setParticipants(prev => prev.filter(p => p.id !== id))
  }

  const handleMultiReset = () => {
     setParticipants(prev => prev.map(p => ({
        ...p, isRunning: false, isFinished: false, elapsedMs: 0, startTime: null
     })))
  }

  // --- History Logic ---
  const saveToHistory = (label: string, timeMs: number, participant?: string) => {
    setHistory(prev => [{
      id: Date.now().toString(),
      date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      label,
      timeMs,
      participant
    }, ...prev])
  }

  const clearHistory = () => {
    if (confirm("Wirklich alle Einträge löschen?")) {
      setHistory([])
    }
  }

  const copyHistory = () => {
    const text = history.map(h => `${h.date} - ${h.label}: ${formatTime(h.timeMs)}`).join("\n")
    navigator.clipboard.writeText(text)
  }

  // --- Render Helpers ---
  const displayMs = isCountdown ? countdownTarget - elapsedMs : elapsedMs
  const isDanger = isCountdown && displayMs < 10000 && displayMs > 0
  const isWarning = isCountdown && displayMs < 30000 && displayMs >= 10000
  
  const getLapColor = (lapLapTime: number) => {
    if (laps.length < 2) return "bg-white/10"
    const times = laps.map(l => l.lapTime)
    const min = Math.min(...times)
    const max = Math.max(...times)
    if (lapLapTime === min) return "bg-green-500/20 text-green-300 border-green-500/50"
    if (lapLapTime === max) return "bg-red-500/20 text-red-300 border-red-500/50"
    return "bg-white/10"
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/10">
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-[300px]">
             <TabsList className="grid w-full grid-cols-2 bg-transparent">
                <TabsTrigger value="single" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">Einzeln</TabsTrigger>
                <TabsTrigger value="multi" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">Teilnehmer</TabsTrigger>
             </TabsList>
          </Tabs>
          
          {mode === "single" && (
             <div className="flex items-center gap-2 px-4 shadow-sm border border-white/10 rounded-full py-1.5">
                <Timer className="w-4 h-4 text-white/70" />
                <span className="text-sm font-medium text-white/80">Countdown</span>
                <Switch 
                   checked={isCountdown} 
                   onCheckedChange={(c) => {
                       setIsCountdown(c); 
                       if(isRunning) handleStop(); 
                       handleReset();
                   }} 
                />
             </div>
          )}
       </div>

       {mode === "single" && (
          <div className="space-y-6">
             {isCountdown && (
                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-col gap-4">
                    <div className="flex gap-2">
                       <Input 
                          value={countdownTargetInput}
                          onChange={(e) => setCountdownTargetInput(e.target.value)}
                          onBlur={() => setCountdownTarget(parseInputToMs(countdownTargetInput))}
                          placeholder="MM:SS"
                          className="bg-white/5 border-white/20 text-white w-32 font-mono"
                          disabled={isRunning}
                       />
                       <Button variant="outline" onClick={() => setCountdownTarget(parseInputToMs(countdownTargetInput))} disabled={isRunning} className="text-white border-white/20 hover:bg-white/10 hover:text-white">
                          Setzen
                       </Button>
                       <Button variant={showConfigurator ? "default" : "outline"} onClick={() => setShowConfigurator(!showConfigurator)} className={showConfigurator ? "bg-brand-lime text-brand-navy hover:bg-brand-lime/90" : "text-white border-white/20 hover:bg-white/10"}>
                          <Calculator className="w-4 h-4 mr-2" /> Konfigurator
                       </Button>
                    </div>

                    <AnimatePresence>
                       {showConfigurator && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-4">
                              <h3 className="font-bold text-white text-lg">Einbau-Zeit Berechner</h3>
                              <p className="text-sm text-white/70">Wähle die Komponenten für das Fahrzeug, um die empfohlene Zeit zu berechnen.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Zentrale */}
                                  <div className="space-y-2">
                                     <label className="text-sm text-white/70">Zentrale</label>
                                     <div className="flex bg-white/5 rounded-md p-1 border border-white/10">
                                         <Button variant="ghost" size="sm" className={`flex-1 ${config.zentrale === "wipro" ? "bg-white/20 text-white" : "text-white/50"}`} onClick={() => setConfig({...config, zentrale: "wipro"})}>WiPro III (30m)</Button>
                                         <Button variant="ghost" size="sm" className={`flex-1 ${config.zentrale === "cas" ? "bg-white/20 text-white" : "text-white/50"}`} onClick={() => setConfig({...config, zentrale: "cas"})}>C.A.S. (45m)</Button>
                                         <Button variant="ghost" size="sm" className={`flex-1 ${config.zentrale === "none" ? "bg-white/20 text-white" : "text-white/50"}`} onClick={() => setConfig({...config, zentrale: "none"})}>Ohne</Button>
                                     </div>
                                  </div>

                                  {/* Pro-finder */}
                                  <div className="space-y-2 flex flex-col justify-end">
                                      <div className="flex items-center justify-between bg-white/5 p-2 rounded border border-white/10">
                                          <span className="text-sm text-white">Pro-finder Ortung (20m)</span>
                                          <Switch checked={config.profinder} onCheckedChange={(c) => setConfig({...config, profinder: c})} />
                                      </div>
                                  </div>

                                  {/* Magnetkontakte */}
                                  <div className="space-y-2">
                                     <label className="text-sm text-white/70">Funk-Magnetkontakte (je 5m)</label>
                                     <div className="flex items-center gap-4 bg-white/5 p-1 rounded border border-white/10 justify-between px-4 h-10">
                                            <Button aria-label="Weniger Magnetkontakte" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setConfig({...config, magnetKontakte: Math.max(0, config.magnetKontakte - 1)})}>
                                                <Minus className="w-4 h-4 text-white"/>
                                            </Button>
                                            <span className="text-white font-bold">{config.magnetKontakte}</span>
                                            <Button aria-label="Mehr Magnetkontakte" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setConfig({...config, magnetKontakte: config.magnetKontakte + 1})}>
                                                <Plus className="w-4 h-4 text-white"/>
                                            </Button>
                                     </div>
                                  </div>

                                  {/* Zubehör */}
                                  <div className="space-y-2 flex flex-col justify-end gap-2">
                                      <div className="flex items-center justify-between bg-white/5 p-2 rounded border border-white/10">
                                          <span className="text-sm text-white">Funk-Kabelschleife (10m)</span>
                                          <Switch checked={config.kabelschleife} onCheckedChange={(c) => setConfig({...config, kabelschleife: c})} />
                                      </div>
                                      <div className="flex items-center justify-between bg-white/5 p-2 rounded border border-white/10">
                                          <span className="text-sm text-white">T.S.A. Rauchmelder (10m)</span>
                                          <Switch checked={config.rauchmelder} onCheckedChange={(c) => setConfig({...config, rauchmelder: c})} />
                                      </div>
                                  </div>
                              </div>
                              <div className="pt-4 border-t border-white/10 flex justify-between items-center mt-4">
                                  <div className="text-white">
                                      Berechnete Zeit: <span className="font-bold text-brand-lime text-2xl ml-2">{calcConfigTime()}</span> Min.
                                  </div>
                                  <Button className="bg-brand-lime text-brand-navy hover:bg-brand-lime/90 font-bold" onClick={() => {
                                      const mins = calcConfigTime()
                                      const newTargetStr = `${mins}:00`
                                      setCountdownTargetInput(newTargetStr)
                                      setCountdownTarget(mins * 60 * 1000)
                                      setShowConfigurator(false)
                                  }}>Zeit übernehmen</Button>
                              </div>
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </motion.div>
             )}

             <Card className="bg-white/10 border-white/20 backdrop-blur-md overflow-hidden relative border-2">
                <CardContent className="pt-16 pb-16 flex flex-col items-center justify-center relative z-10">
                   <motion.div 
                      key={isCountdown ? "count" : "up"}
                      className={`text-6xl md:text-8xl font-mono font-bold tracking-tighter tabular-nums transition-colors duration-300 ${isDanger ? 'text-red-500 animate-pulse' : isWarning ? 'text-yellow-400' : 'text-white'}`}
                   >
                      {formatTime(displayMs)}
                   </motion.div>
                   
                   <div className="mt-12 flex flex-wrap justify-center gap-4">
                      <Button 
                         size="lg" 
                         className={`w-20 h-20 rounded-full border-4 shadow-xl shadow-black/20 ${isRunning ? 'bg-amber-500 border-amber-600 hover:bg-amber-600' : 'bg-brand-lime border-brand-lime hover:opacity-90'} text-brand-navy`}
                         onClick={handleStartPause}
                      >
                         {isRunning ? <Pause className="w-8 h-8"/> : <Play className="w-8 h-8 ml-1"/>}
                      </Button>
                      <Button 
                         size="lg" 
                         variant="destructive"
                         className="w-20 h-20 rounded-full border-4 shadow-xl border-red-600 shadow-black/20 bg-red-500 hover:bg-red-600"
                         onClick={handleStop}
                         disabled={!isRunning && elapsedMs === 0}
                      >
                         <Square className="w-8 h-8"/>
                      </Button>
                      {!isCountdown && (
                         <Button 
                            size="lg" 
                            className="w-20 h-20 rounded-full border-4 shadow-xl border-blue-600 shadow-black/20 bg-blue-500 text-white hover:bg-blue-600"
                            onClick={handleLap}
                            disabled={!isRunning}
                         >
                            <Flag className="w-8 h-8"/>
                         </Button>
                      )}
                      <Button 
                         size="lg" 
                         variant="outline"
                         className="w-20 h-20 rounded-full border-4 shadow-xl border-white/20 shadow-black/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                         onClick={handleReset}
                         disabled={isRunning || elapsedMs === 0}
                      >
                         <RotateCcw className="w-8 h-8"/>
                      </Button>
                   </div>
                </CardContent>
             </Card>

             {laps.length > 0 && !isCountdown && (
                <Card className="bg-white/10 border-white/20 backdrop-blur-md text-white">
                   <CardHeader className="py-4">
                      <CardTitle className="text-lg flex items-center gap-2"><Flag className="w-4 h-4"/> Rundenzeiten</CardTitle>
                   </CardHeader>
                   <CardContent className="p-0 max-h-[300px] overflow-y-auto custom-scrollbar">
                      <div className="divide-y divide-white/10">
                         {laps.map((lap, i) => (
                            <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1,y:0}} key={i} className="flex justify-between items-center p-4">
                               <span className="font-medium text-white/70">M-{laps.length - i}</span>
                               <span className="font-mono text-lg">{formatTime(lap.lapTime)}</span>
                               <span className="font-mono text-sm opacity-50 w-20 text-right">
                                  {lap.delta > 0 ? '+' : ''}{lap.delta !== 0 ? formatTime(Math.abs(lap.delta)) : '--:--.--'}
                               </span>
                               <Badge variant="outline" className={`w-24 justify-center ${getLapColor(lap.lapTime)}`}>
                                  {formatTime(lap.totalTime)}
                               </Badge>
                            </motion.div>
                         ))}
                      </div>
                   </CardContent>
                </Card>
             )}
          </div>
       )}

       {mode === "multi" && (
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <Button onClick={addParticipant} variant="outline" className="text-white border-white/20 hover:bg-white/10 bg-white/5" disabled={participants.length >= 6}>
                   + Team hinzufügen
                </Button>
                <div className="flex gap-2">
                   <Button onClick={handleMultiReset} variant="outline" className="text-white border-white/20 hover:bg-white/10" size="sm">
                       <RotateCcw className="w-4 h-4 mr-2"/> Alle Reset
                   </Button>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                   {participants.map((p, idx) => (
                      <motion.div key={p.id} initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}}>
                         <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-white/5">
                               <Input 
                                  value={p.name} 
                                  onChange={(e) => setParticipants(prev => prev.map(x => x.id === p.id ? {...x, name: e.target.value} : x))}
                                  className="bg-transparent border-none text-lg font-bold text-white px-0 h-auto focus-visible:ring-0 max-w-[150px]"
                               />
                                <Button aria-label="Teilnehmer entfernen" variant="ghost" size="icon" onClick={() => removeParticipant(p.id)} className="h-8 w-8 text-white/50 hover:text-red-400 hover:bg-red-500/10">
                                   <Trash2 className="w-4 h-4"/>
                               </Button>
                            </CardHeader>
                            <CardContent className="p-4 flex gap-4 items-center justify-between">
                               <div className="font-mono text-3xl font-bold text-white tabular-nums">
                                  {formatTime(p.elapsedMs)}
                               </div>
                               <div className="flex gap-2">
                                  <Button 
                                     size="icon" 
                                     className={`rounded-full shadow-md ${p.isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-brand-lime text-brand-navy hover:bg-brand-lime/90'}`}
                                     onClick={() => toggleParticipantTimer(p.id)}
                                     disabled={p.isFinished}
                                  >
                                     {p.isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4 ml-0.5"/>}
                                  </Button>
                                  <Button 
                                     size="icon" 
                                     variant="destructive"
                                     className="rounded-full shadow-md bg-red-500 hover:bg-red-600"
                                     onClick={() => stopParticipantTimer(p.id, p.name)}
                                     disabled={!p.isRunning && p.elapsedMs === 0}
                                  >
                                     <Square className="w-4 h-4"/>
                                  </Button>
                               </div>
                            </CardContent>
                         </Card>
                      </motion.div>
                   ))}
                </AnimatePresence>
             </div>

             {/* Ranking Overview */}
             {participants.some(p => p.isFinished) && (
                <Card className="bg-brand-navy/50 border-brand-lime/30 text-white mt-8">
                   <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2"><Award className="w-5 h-5 text-brand-lime"/> Ranking (Fertig)</CardTitle>
                   </CardHeader>
                   <CardContent>
                      <div className="space-y-2">
                         {[...participants].filter(p => p.isFinished).sort((a,b) => a.elapsedMs - b.elapsedMs).map((p, i) => (
                            <div key={p.id} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                               <span className="font-bold flex items-center gap-2">
                                  <span className="opacity-50 text-sm">#{i+1}</span> {p.name}
                               </span>
                               <span className="font-mono">{formatTime(p.elapsedMs)}</span>
                            </div>
                         ))}
                      </div>
                   </CardContent>
                </Card>
             )}
          </div>
       )}

       {/* History */}
       {history.length > 0 && (
          <Card className="bg-white/5 border-white/10 text-white/80">
             <CardHeader className="py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">Verlauf</CardTitle>
                <div className="flex gap-2">
                   <Button variant="ghost" size="sm" onClick={copyHistory} className="h-8 px-2 hover:bg-white/10 hover:text-white"><Copy className="w-4 h-4 mr-2"/> Kopieren</Button>
                   <Button variant="ghost" size="sm" onClick={clearHistory} className="h-8 px-2 text-red-400 hover:bg-red-500/20 hover:text-red-300"><Trash2 className="w-4 h-4 mr-2"/> Löschen</Button>
                </div>
             </CardHeader>
             <CardContent className="p-0">
                <div className="max-h-40 overflow-y-auto custom-scrollbar divide-y divide-white/5">
                   {history.map(h => (
                      <div key={h.id} className="p-2 px-4 flex justify-between items-center text-sm">
                         <div>
                            <span className="opacity-50 mr-3">{h.date}</span>
                            <span className="font-medium">{h.label}</span>
                         </div>
                         <span className="font-mono text-white font-bold">{formatTime(h.timeMs, false)}</span>
                      </div>
                   ))}
                </div>
             </CardContent>
          </Card>
       )}
    </div>
  )
}
