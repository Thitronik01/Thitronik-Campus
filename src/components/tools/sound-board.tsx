"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Info, Volume2, Trophy, RotateCcw, Volume1, VolumeX, Check, X, Bell } from "lucide-react"

import { sounds, ThitronikSound } from "@/data/sound-board-sounds"

type Mode = "board" | "quiz"
type Category = "alle" | "gaswarner" | "alarmanlage" | "funkfernbedienung" | "sonstige"

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function SoundBoard() {
  const [mode, setMode] = useState<Mode>("board")
  const [volume, setVolume] = useState([80])
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category>("alle")
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<ThitronikSound[]>([])
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizOptions, setQuizOptions] = useState<ThitronikSound[]>([])
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null) // the ID user selected
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 10 })
  const [replayCount, setReplayCount] = useState(0)
  const [gameState, setGameState] = useState<"setup" | "playing" | "finished">("setup")
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialization & Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
         audioRef.current.pause()
         audioRef.current.src = ""
      }
    }
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const playSound = (src: string, id: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setActiveSoundId(id)
    try {
        audioRef.current = new Audio(src)
        audioRef.current.volume = volume[0] / 100
        audioRef.current.onended = () => setActiveSoundId(null)
        audioRef.current.play().catch(() => {
           setActiveSoundId(null)
           showToast("Sound-Datei nicht verfügbar (Placeholder)")
        })
    } catch {
       setActiveSoundId(null)
       showToast("Audio konnte nicht abgespielt werden")
    }
  }

  const togglePlay = (sound: ThitronikSound) => {
    if (activeSoundId === sound.id) {
       audioRef.current?.pause()
       setActiveSoundId(null)
    } else {
       playSound(sound.audioSrc, sound.id)
    }
  }

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedId(prev => prev === id ? null : id)
  }

  // Quiz Logic
  const startQuiz = () => {
     if (audioRef.current) audioRef.current.pause()
     setActiveSoundId(null)
     const shuffled = shuffle(sounds).slice(0, 10)
     setQuizQuestions(shuffled)
     setQuizIndex(0)
     setQuizScore({ correct: 0, total: 10 })
     setGameState("playing")
     prepareQuizRound(shuffled[0])
  }

  const prepareQuizRound = (currentQ: ThitronikSound) => {
     setQuizAnswer(null)
     setReplayCount(0)
     let opts = sounds.filter(s => s.id !== currentQ.id)
     opts = shuffle(opts).slice(0, 3)
     opts.push(currentQ)
     opts = shuffle(opts)
     setQuizOptions(opts)
     
     // auto play after short delay
     setTimeout(() => {
        playSound(currentQ.audioSrc, "quiz-audio")
     }, 500)
  }

  const replayQuizSound = () => {
     if (replayCount >= 3) return
     const currentQ = quizQuestions[quizIndex]
     playSound(currentQ.audioSrc, "quiz-audio")
     setReplayCount(prev => prev + 1)
  }

  const answerQuiz = (selectedId: string) => {
     if (quizAnswer) return // already answered
     if (audioRef.current) audioRef.current.pause()
     setActiveSoundId(null)
     
     setQuizAnswer(selectedId)
     const currentQ = quizQuestions[quizIndex]
     const isCorrect = selectedId === currentQ.id
     
     if (isCorrect) {
        setQuizScore(prev => ({ ...prev, correct: prev.correct + 1 }))
     }
     
     // Auto next
     setTimeout(() => {
         if (quizIndex < quizQuestions.length - 1) {
             setQuizIndex(prev => prev + 1)
             prepareQuizRound(quizQuestions[quizIndex + 1])
         } else {
             setGameState("finished")
         }
     }, 2000)
  }

  const filteredSounds = selectedCategory === "alle" ? sounds : sounds.filter(s => s.category === selectedCategory)

  return (
    <div className="space-y-6 relative">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
             initial={{ opacity: 0, y: 50, x: "-50%" }}
             animate={{ opacity: 1, y: 0, x: "-50%" }}
             exit={{ opacity: 0, y: 20, x: "-50%" }}
             className="fixed bottom-8 left-1/2 z-50 bg-destructive text-destructive-foreground px-6 py-3 rounded-full shadow-lg font-medium flex items-center gap-2"
          >
             <Bell className="w-4 h-4" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-center bg-white/5 p-2 rounded-lg border border-white/10 gap-4">
         <Tabs value={mode} onValueChange={(v) => {
             setMode(v as Mode)
             if (audioRef.current) audioRef.current.pause()
             setActiveSoundId(null)
             if (v === 'quiz') setGameState("setup")
         }} className="w-[300px]">
            <TabsList className="grid w-full grid-cols-2 bg-transparent">
               <TabsTrigger value="board" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">Board</TabsTrigger>
               <TabsTrigger value="quiz" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">Quiz</TabsTrigger>
            </TabsList>
         </Tabs>
         
         <div className="flex items-center gap-4 px-4 w-full sm:w-auto">
            {volume[0] === 0 ? <VolumeX className="w-5 h-5 text-white/50" /> : volume[0] < 50 ? <Volume1 className="w-5 h-5 text-white/70" /> : <Volume2 className="w-5 h-5 text-white" />}
            <input 
               type="range"
               min="0"
               max="100"
               value={volume[0]} 
               onChange={(e) => {
                  const v = [parseInt(e.target.value)]
                  setVolume(v)
                  if(audioRef.current) audioRef.current.volume = v[0] / 100
               }}
               className="w-32 accent-brand-lime"
            />
         </div>
      </div>

      {mode === "board" && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-wrap gap-2">
               {["alle", "gaswarner", "alarmanlage", "funkfernbedienung", "sonstige"].map(cat => (
                  <Button
                     key={cat}
                     variant={selectedCategory === cat ? "default" : "outline"}
                     onClick={() => setSelectedCategory(cat as Category)}
                     className={selectedCategory === cat ? "bg-brand-lime text-brand-navy hover:bg-brand-lime/90 border-transparent capitalize" : "border-white/20 text-white hover:bg-white/10 capitalize"}
                  >
                     {cat}
                  </Button>
               ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {filteredSounds.map((sound, i) => {
                  const isActive = activeSoundId === sound.id
                  const isExpanded = expandedId === sound.id
                  return (
                     <motion.div
                        key={sound.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                     >
                        <Card 
                          className={`bg-white/10 border backdrop-blur-md overflow-hidden transition-all duration-300 ${isActive ? 'border-brand-lime ring-2 ring-brand-lime/50 shadow-lg shadow-brand-lime/20' : 'border-white/20 hover:bg-white/15'}`}
                        >
                           <CardContent className="p-4 flex flex-col relative">
                              <Button
                                 variant="ghost"
                                 size="icon"
                                 className="absolute top-2 right-2 text-white/50 hover:text-white hover:bg-white/10"
                                 onClick={(e) => toggleExpand(sound.id, e)}
                              >
                                 <Info className="w-4 h-4" />
                              </Button>
                              <div 
                                onClick={() => togglePlay(sound)}
                                className="cursor-pointer flex flex-col items-center justify-center p-4 pt-6"
                              >
                                 <div className="relative mb-4">
                                    <div className={`text-5xl ${isActive ? 'animate-pulse' : ''}`}>{sound.icon}</div>
                                    {isActive && (
                                       <span className="absolute -top-2 -right-2 flex h-4 w-4">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-lime"></span>
                                       </span>
                                    )}
                                 </div>
                                 <h3 className="font-bold text-white text-center text-lg leading-tight mb-1">{sound.name}</h3>
                                 <p className="text-brand-lime text-sm font-medium">{sound.product}</p>
                              </div>

                              <AnimatePresence>
                                 {isExpanded && (
                                    <motion.div
                                       initial={{ height: 0, opacity: 0 }}
                                       animate={{ height: "auto", opacity: 1 }}
                                       exit={{ height: 0, opacity: 0 }}
                                       className="pt-4 mt-2 border-t border-white/10"
                                    >
                                       <p className="text-white/80 text-sm">{sound.description}</p>
                                       <Badge variant="outline" className="mt-2 bg-black/20 text-white/70 border-none capitalize">{sound.category}</Badge>
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </CardContent>
                        </Card>
                     </motion.div>
                  )
               })}
            </div>
         </motion.div>
      )}

      {mode === "quiz" && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="bg-white/10 border-white/20 backdrop-blur-md text-white">
               {gameState === "setup" && (
                  <CardContent className="pt-10 pb-10 flex flex-col items-center text-center space-y-6">
                     <div className="w-20 h-20 rounded-full bg-brand-lime/20 flex items-center justify-center mb-2">
                        <Volume2 className="w-10 h-10 text-brand-lime" />
                     </div>
                     <h2 className="text-2xl font-bold">Sound-Quiz</h2>
                     <p className="text-white/70 max-w-md">
                        Hör genau hin! In 10 Runden spielen wir einen Thitronik Alarm- oder Signalton ab. Kannst du den richtigen Auslöser erkennen?
                     </p>
                     <Button size="lg" onClick={startQuiz} className="bg-brand-lime text-brand-navy hover:bg-brand-lime/90 font-bold px-8 py-6 text-lg mt-4">
                        <Play className="w-5 h-5 mr-2" /> Quiz starten
                     </Button>
                  </CardContent>
               )}

               {gameState === "playing" && quizQuestions.length > 0 && (
                  <div className="space-y-6 p-6">
                     <div className="flex justify-between items-center opacity-70 font-medium text-sm">
                        <span>Runde {quizIndex + 1} / {quizScore.total}</span>
                        <span>Korrekte: {quizScore.correct}</span>
                     </div>
                     
                     <div className="flex flex-col items-center justify-center py-8">
                        {activeSoundId === "quiz-audio" ? (
                           <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-24 h-24 rounded-full bg-brand-lime/20 flex items-center justify-center mb-6">
                              <Volume2 className="w-12 h-12 text-brand-lime" />
                           </motion.div>
                        ) : (
                           <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-6">
                              <Volume2 className="w-12 h-12 text-white/20" />
                           </div>
                        )}
                        
                        <Button 
                           variant="outline" 
                           onClick={replayQuizSound} 
                           disabled={replayCount >= 3 || activeSoundId === "quiz-audio" || !!quizAnswer}
                           className="border-white/20 text-white hover:bg-white/10 bg-transparent flex items-center gap-2"
                        >
                           <RotateCcw className="w-4 h-4"/> Sound nochmal abspielen ({3 - replayCount} übrig)
                        </Button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {quizOptions.map((opt, i) => {
                           const isSelected = quizAnswer === opt.id
                           const currentQ = quizQuestions[quizIndex]
                           const isCorrectTarget = opt.id === currentQ.id
                           
                           let btnClass = "border-white/20 text-white hover:bg-white/10"
                           if (quizAnswer) {
                               if (isCorrectTarget) btnClass = "bg-green-500/20 border-green-500 text-green-300"
                               else if (isSelected) btnClass = "bg-red-500/20 border-red-500 text-red-300"
                               else btnClass = "opacity-50 border-white/10 text-white/50"
                           }

                           return (
                              <Button
                                 key={i}
                                 variant="outline"
                                 disabled={!!quizAnswer}
                                 onClick={() => answerQuiz(opt.id)}
                                 className={`h-auto py-4 flex flex-col items-center gap-2 relative ${btnClass}`}
                              >
                                 <span className="text-2xl">{opt.icon}</span>
                                 <span className="font-bold text-center whitespace-normal">{opt.name}</span>
                                 <span className="text-xs opacity-70">{opt.product}</span>
                                 
                                 {quizAnswer && isCorrectTarget && (
                                     <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute top-2 right-2 bg-green-500 rounded-full p-1 text-white">
                                        <Check className="w-3 h-3"/>
                                     </motion.div>
                                 )}
                                 {quizAnswer && isSelected && !isCorrectTarget && (
                                     <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute top-2 right-2 bg-red-500 rounded-full p-1 text-white">
                                        <X className="w-3 h-3"/>
                                     </motion.div>
                                 )}
                              </Button>
                           )
                        })}
                     </div>
                  </div>
               )}

               {gameState === "finished" && (
                   <CardContent className="pt-12 pb-10 flex flex-col items-center text-center space-y-6">
                        <Trophy className="w-16 h-16 text-yellow-400 mb-2" />
                        <h2 className="text-3xl font-bold">Quiz Beendet!</h2>
                        <div className="text-5xl font-black text-brand-lime tracking-tighter">
                           {quizScore.correct} <span className="text-2xl font-medium text-white/50">/ {quizScore.total}</span>
                        </div>
                        <p className="text-white/70">Richtige Antworten</p>
                        <div className="pt-6 w-full max-w-sm flex flex-col gap-3">
                           <Button onClick={startQuiz} className="bg-brand-lime text-brand-navy font-bold w-full gap-2">
                              <RotateCcw className="w-4 h-4"/> Neues Quiz
                           </Button>
                           <Button variant="outline" onClick={() => setMode("board")} className="border-white/20 text-white w-full hover:bg-white/10">
                              Zum Sound-Board
                           </Button>
                        </div>
                   </CardContent>
               )}
            </Card>
         </motion.div>
      )}
    </div>
  )
}
