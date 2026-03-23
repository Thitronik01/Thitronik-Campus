"use client"

import React from "react"
import { PremiumBackground } from "@/components/layout/premium-background"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"
import SoundBoard from "@/components/tools/sound-board"

export default function SoundBoardPage() {
  const params = useParams()
  const locale = params?.locale || "de"

  return (
    <PremiumBackground>
      <div className="min-h-screen p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto space-y-6"
        >
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" asChild>
              <Link href={`/${locale}/tools`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Sound-Board</h1>
              <p className="text-white/70">Thitronik Alarm- und Signaltöne abspielen, kennenlernen und im Quiz testen.</p>
            </div>
          </div>

          <SoundBoard />
        </motion.div>
      </div>
    </PremiumBackground>
  )
}
