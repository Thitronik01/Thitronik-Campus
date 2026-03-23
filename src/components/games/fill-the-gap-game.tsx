"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Check, X, Star, RotateCcw, ArrowRight, Clock, Trophy, Puzzle, AlertCircle, Search } from "lucide-react"

import { fillTheGapQuestions, FillTheGapQuestion } from "@/data/fill-the-gap-questions"

type GameState = "setup" | "playing" | "review" | "finished"
type Category = "produkte" | "einbau" | "alarmsysteme" | "allgemein" | "alle"
type Difficulty = "leicht" | "mittel" | "schwer"

interface AnswerRecord {
  questionId: string
  userAnswer: string
  isCorrect: boolean
  timeTakenMs: number
}

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function FillTheGapGame({ onFinished }: { onFinished?: (score: number) => void }) {
  const [gameState, setGameState] = useState<GameState>("setup")
  
  // Setup state
  const [selectedCategory, setSelectedCategory] = useState<Category>("alle")
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("leicht")
  const [questionCount, setQuestionCount] = useState<number>(5)
  
  // Play state
  const [questions, setQuestions] = useState<FillTheGapQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)
  const [elapsedTimeMs, setElapsedTimeMs] = useState(0)
  
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Start the game
  const startGame = () => {
    let filtered = fillTheGapQuestions
    if (selectedCategory !== "alle") {
      filtered = filtered.filter((q) => q.category === selectedCategory || q.category === "allgemein") // Always include allgemein as fallback if needed
    }
    // ensure exact category matches first, then fill up if needed
    let exactMatches = fillTheGapQuestions.filter((q) => selectedCategory === "alle" || q.category === selectedCategory)
    
    if (exactMatches.length < questionCount) {
       exactMatches = [...exactMatches, ...fillTheGapQuestions.filter(q => q.category !== selectedCategory)]
    }
    
    const shuffled = shuffle(exactMatches).slice(0, questionCount)
    setQuestions(shuffled)
    setCurrentIndex(0)
    setAnswers([])
    setUserAnswer("")
    setIsAnswered(false)
    setIsCorrect(null)
    setGameState("playing")
    setQuestionStartTime(performance.now())
    setElapsedTimeMs(0)
  }

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setUserAnswer("")
      setIsAnswered(false)
      setIsCorrect(null)
      setQuestionStartTime(performance.now())
    } else {
      setGameState("review")
    }
  }

  const checkAnswer = (answerOverride?: string) => {
    if (isAnswered) return
    
    const currentQuestion = questions[currentIndex]
    const finalAnswer = answerOverride ?? userAnswer
    const finalTrimmed = finalAnswer.trim().toLowerCase()
    
    const isOkContext = finalTrimmed === currentQuestion.answer.toLowerCase() || 
                       (currentQuestion.acceptedAlternatives && currentQuestion.acceptedAlternatives.some(a => a.toLowerCase() === finalTrimmed))
    
    const timeTaken = performance.now() - questionStartTime
    
    setIsCorrect(!!isOkContext)
    setIsAnswered(true)
    
    // Play sound feedback placeholder
    try {
        const audio = new Audio(isOkContext ? "/sounds/success.mp3" : "/sounds/error.mp3")
        // we won't actually play anything because files aren't there but we follow the prompt 
        // audio.play().catch(() => {})
    } catch {}

    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      userAnswer: finalAnswer,
      isCorrect: !!isOkContext,
      timeTakenMs: timeTaken
    }])

    setTimeout(() => {
      handleNextQuestion()
    }, 1500)
  }

  // Effect for timer
  useEffect(() => {
    if (gameState === "playing" && !isAnswered) {
      let animationFrameId: number
      const start = performance.now()
      
      const updateTimer = () => {
        setElapsedTimeMs(performance.now() - questionStartTime)
        animationFrameId = requestAnimationFrame(updateTimer)
      }
      animationFrameId = requestAnimationFrame(updateTimer)
      return () => cancelAnimationFrame(animationFrameId)
    }
  }, [gameState, isAnswered, questionStartTime])
  
  // Derived State (moved to top level to obey rules of hooks)
  const currentQ = questions[currentIndex]
  
  const displayOptions = useMemo(() => {
     if (gameState !== "playing" || !currentQ || selectedDifficulty === "schwer") return []
     
     let opts = [...currentQ.options]
     if (!opts.includes(currentQ.answer)) opts.push(currentQ.answer)
     opts = shuffle(opts)
     
     let finalOpts = []
     if (selectedDifficulty === "leicht") finalOpts = opts.slice(0, 3)
     else finalOpts = opts.slice(0, 5)
     
     // ensure correct answer is always in options!
     if (!finalOpts.includes(currentQ.answer)) {
         finalOpts[0] = currentQ.answer
         finalOpts = shuffle(finalOpts)
     }
     return finalOpts
  }, [currentIndex, currentQ?.id, selectedDifficulty, gameState])

  const hasCalledFinishedRef = useRef(false)
  useEffect(() => {
    if (gameState === "setup" || gameState === "playing") {
      hasCalledFinishedRef.current = false
    }
    if (gameState === "finished" && !hasCalledFinishedRef.current && onFinished) {
      const correctCount = answers.filter(a => a.isCorrect).length
      onFinished(correctCount * 10)
      hasCalledFinishedRef.current = true
    }
  }, [gameState, answers, onFinished])

  // Setup View
  if (gameState === "setup") {
    return (
      <Card className="bg-white/10 border-white/20 backdrop-blur-md text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Puzzle className="w-6 h-6 text-brand-lime" /> Setup Lückentext
          </CardTitle>
          <CardDescription className="text-white/60">
            Wähle dein Thema und den Schwierigkeitsgrad.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">Kategorie</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {["alle", "produkte", "einbau", "alarmsysteme", "allgemein"].map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat as Category)}
                  className={selectedCategory === cat ? "bg-brand-lime text-brand-navy hover:bg-brand-lime/90 border-transparent" : "border-white/20 text-white hover:bg-white/10"}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium">Schwierigkeitsgrad</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "leicht", label: "Leicht", desc: "Multiple-Choice (3)" },
                { id: "mittel", label: "Mittel", desc: "Multiple-Choice (5)" },
                { id: "schwer", label: "Schwer", desc: "Freitext" },
              ].map((diff) => (
                <Button
                  key={diff.id}
                  variant={selectedDifficulty === diff.id ? "default" : "outline"}
                  onClick={() => setSelectedDifficulty(diff.id as Difficulty)}
                  className={`flex flex-col h-auto py-3 px-2 ${selectedDifficulty === diff.id ? 'bg-brand-lime text-brand-navy hover:bg-brand-lime/90 border-transparent' : 'border-white/20 text-white hover:bg-white/10'}`}
                >
                  <span className="font-bold">{diff.label}</span>
                  <span className="text-xs opacity-70 mt-1">{diff.desc}</span>
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium">Anzahl Fragen</label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((num) => (
                <Button
                  key={num}
                  variant={questionCount === num ? "default" : "outline"}
                  onClick={() => setQuestionCount(num)}
                  className={questionCount === num ? "bg-brand-lime text-brand-navy hover:bg-brand-lime/90 border-transparent" : "border-white/20 text-white hover:bg-white/10"}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startGame} className="w-full bg-brand-lime text-brand-navy hover:bg-brand-lime/90 font-bold gap-2 text-lg py-6">
            <Check className="w-5 h-5" /> Spiel starten
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Playing View
  if (gameState === "playing" && questions.length > 0) {
    const progress = ((currentIndex) / questions.length) * 100
    const sentenceParts = currentQ.sentence.split("{{gap}}")

    return (
      <motion.div
        key={`question-${currentIndex}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center text-white/80">
           <span className="font-bold">Frage {currentIndex + 1} / {questions.length}</span>
           <span className="flex items-center gap-1 font-mono"><Clock className="w-4 h-4"/> {Math.floor(elapsedTimeMs / 1000)}s</span>
        </div>
        <Progress value={progress} className="h-3 bg-white/10" />
        
        <Card className="bg-white/10 border-white/20 backdrop-blur-md text-white">
          <CardContent className="pt-10 pb-10 text-center relative">
            <p className="text-xl md:text-2xl font-medium leading-relaxed">
              {sentenceParts[0]}
              {selectedDifficulty === "schwer" ? (
                 <span className="inline-block mx-2 relative">
                   <Input
                     ref={inputRef}
                     value={userAnswer}
                     onChange={(e) => setUserAnswer(e.target.value)}
                     disabled={isAnswered}
                     className={`w-36 md:w-48 inline-block text-center border-b-2 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent focus-visible:ring-0 px-1 text-brand-lime placeholder:text-white/30 font-bold ${isAnswered ? (isCorrect ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400') : 'border-white/40 focus:border-brand-lime'}`}
                     placeholder="..."
                     onKeyDown={(e) => {
                       if (e.key === "Enter" && userAnswer.trim().length > 0) {
                         checkAnswer()
                       }
                     }}
                     autoFocus
                   />
                 </span>
              ) : (
                <span className={`inline-block mx-2 min-w-[100px] border-b-2 border-dashed px-2 pb-1 ${isAnswered ? 'border-transparent' : 'border-white/40 animate-pulse'}`}>
                   {isAnswered ? (
                      <Badge variant="outline" className={`text-lg px-3 py-1 ${isCorrect ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-red-500/20 border-red-500 text-red-300'}`}>
                         {userAnswer || "?"}
                      </Badge>
                   ) : userAnswer ? (
                      <Badge variant="outline" className="text-lg px-3 py-1 bg-white/10 text-white border-white/40">
                        {userAnswer}
                      </Badge>
                   ) : (
                      <span className="text-transparent">____</span>
                   )}
                </span>
              )}
              {sentenceParts[1]}
            </p>
            
            <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute bottom-4 right-4"
                  >
                    {isCorrect ? (
                       <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                         <Check className="w-6 h-6 text-white" />
                       </div>
                    ) : (
                       <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">
                         <X className="w-6 h-6 text-white" />
                       </div>
                    )}
                  </motion.div>
                )}
            </AnimatePresence>
          </CardContent>
          
          <CardFooter className="flex-col gap-4 bg-white/5 rounded-b-xl">
             {selectedDifficulty !== "schwer" ? (
                 <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                   {displayOptions.map((opt, i) => {
                     let btnClass = "border-white/20 text-white hover:bg-white/10"
                     if (isAnswered) {
                         if (opt === currentQ.answer) btnClass = "bg-green-500/20 border-green-500 text-green-300 hover:bg-green-500/30"
                         else if (opt === userAnswer) btnClass = "bg-red-500/20 border-red-500 text-red-300 hover:bg-red-500/30"
                         else btnClass = "opacity-50 border-white/10 text-white/50"
                     } else if (opt === userAnswer) {
                         btnClass = "bg-white/20 border-white text-white"
                     }
                     return (
                       <Button
                         key={i}
                         variant="outline"
                         disabled={isAnswered}
                         className={`w-full h-auto py-3 whitespace-normal ${btnClass}`}
                         onClick={() => {
                             setUserAnswer(opt)
                             checkAnswer(opt)
                         }}
                       >
                         {opt}
                       </Button>
                     )
                   })}
                 </div>
             ) : (
                <div className="w-full flex justify-end">
                   <Button 
                     onClick={() => checkAnswer()} 
                     disabled={isAnswered || !userAnswer.trim()}
                     className="bg-brand-lime text-brand-navy hover:bg-brand-lime/90 font-bold"
                   >
                      Prüfen
                   </Button>
                </div>
             )}
             
             {isAnswered && !isCorrect && selectedDifficulty === "schwer" && (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                   className="w-full p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm mt-2 flex items-start gap-2"
                >
                   <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                   <div>
                     <p className="font-bold">Richtige Antwort:</p>
                     <p>{currentQ.answer}</p>
                   </div>
                </motion.div>
             )}
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  // Review View
  if (gameState === "review") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search className="w-6 h-6 text-brand-lime" /> Review
          </h2>
          <Button onClick={() => setGameState("finished")} className="bg-brand-lime text-brand-navy font-bold hover:bg-brand-lime/90 gap-2">
             Weiter zum Ergebnis <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
           {answers.map((ans, idx) => {
              const q = questions.find(q => q.id === ans.questionId)!
              const sentenceParts = q.sentence.split("{{gap}}")
              return (
                 <Card key={idx} className={`bg-white/10 border backdrop-blur-sm ${ans.isCorrect ? 'border-green-500/30' : 'border-red-500/30'}`}>
                    <CardContent className="p-4 space-y-3 text-white">
                      <div className="flex items-start gap-3">
                         <div className={`mt-1 shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${ans.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                           {ans.isCorrect ? <Check className="w-4 h-4 text-white"/> : <X className="w-4 h-4 text-white"/>}
                         </div>
                         <div>
                           <p className="opacity-80 text-sm mb-1">Frage {idx + 1}</p>
                           <p className="font-medium">
                             {sentenceParts[0]}
                             <span className={`inline-block px-1 mx-1 font-bold border-b-2 ${ans.isCorrect ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400 line-through'}`}>
                                {ans.userAnswer || "(Keine Antwort)"}
                             </span>
                             {sentenceParts[1]}
                           </p>
                           {!ans.isCorrect && (
                              <p className="text-green-400 font-bold mt-2 text-sm flex items-center gap-1">
                                <ArrowRight className="w-3 h-3"/> Korrekt: {q.answer}
                              </p>
                           )}
                           {q.explanation && (
                              <p className="text-white/60 text-sm mt-2 italic flex items-start gap-1">
                                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                                {q.explanation}
                              </p>
                           )}
                         </div>
                      </div>
                    </CardContent>
                 </Card>
              )
           })}
        </div>
      </motion.div>
    )
  }

  // Finished View
  if (gameState === "finished") {
    const correctCount = answers.filter(a => a.isCorrect).length
    const accuracy = Math.round((correctCount / questions.length) * 100)

    let stars = 1
    if (accuracy >= 80) stars = 3
    else if (accuracy >= 50) stars = 2
    
    const totalTime = answers.reduce((acc, curr) => acc + curr.timeTakenMs, 0)
    const avgTime = Math.round(totalTime / questions.length / 1000)

    return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-white/10 border-white/20 backdrop-blur-md text-white overflow-hidden">
           <div className="bg-gradient-to-r from-brand-navy/60 to-brand-navy/30 pt-10 pb-6 text-center shadow-inner relative">
              <Trophy className="w-16 h-16 text-brand-lime mx-auto mb-4 opacity-20 absolute top-4 right-4" />
              <h2 className="text-3xl font-bold mb-2">Ergebnis</h2>
              
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3].map((starIdx) => (
                   <motion.div
                     key={starIdx}
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ delay: 0.3 + (starIdx * 0.2), type: "spring" }}
                   >
                     <Star className={`w-12 h-12 ${starIdx <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
                   </motion.div>
                ))}
              </div>
              
              <p className="text-5xl font-black text-brand-lime tracking-tight">
                 {correctCount} <span className="text-2xl text-white/50 font-medium">/ {questions.length}</span>
              </p>
           </div>
           
           <CardContent className="grid grid-cols-2 gap-4 p-6">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                 <p className="text-white/60 text-sm mb-1">Genauigkeit</p>
                 <p className="text-2xl font-bold">{accuracy}%</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                 <p className="text-white/60 text-sm mb-1">Ø Zeit pro Frage</p>
                 <p className="text-2xl font-bold">{avgTime}s</p>
              </div>
           </CardContent>
           <CardFooter className="flex flex-col gap-3 p-6 pt-0">
              <Button onClick={() => startGame()} className="w-full bg-brand-lime text-brand-navy font-bold gap-2">
                 <RotateCcw className="w-4 h-4"/> Nochmal spielen
              </Button>
              <Button onClick={() => setGameState("setup")} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                 Andere Einstellungen
              </Button>
           </CardFooter>
        </Card>
      </motion.div>
    )
  }

  return null
}
