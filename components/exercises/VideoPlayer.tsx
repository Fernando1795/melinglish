'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, BookOpen, ChevronRight } from 'lucide-react'

type Props = {
  lessonTitle: string
  moduleTitle: string
  videoUrl?: string
  keyConcepts?: string[]
  onContinue: () => void
}

export default function VideoPlayer({ lessonTitle, moduleTitle, videoUrl, keyConcepts, onContinue }: Props) {
  const [videoReady, setVideoReady] = useState(false)

  // Convierte URL de YouTube normal a URL de embed
  function toEmbedUrl(url: string): string {
    // Acepta: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/)
    if (match) return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`
    return url // Si ya es un embed u otro servicio
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header del tema */}
      <div className="text-center space-y-2">
        <Badge className="bg-blue-100 text-blue-700 font-bold">{moduleTitle}</Badge>
        <h2 className="text-2xl font-black text-gray-900">{lessonTitle}</h2>
        <p className="text-gray-500 font-medium">
          {videoUrl ? '📺 Mira el video antes de practicar' : '📖 Repasa los conceptos clave antes de practicar'}
        </p>
      </div>

      {/* VIDEO — si tiene URL */}
      {videoUrl ? (
        <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-blue-100 bg-black aspect-video">
          <iframe
            src={toEmbedUrl(videoUrl)}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setVideoReady(true)}
            title={lessonTitle}
          />
        </div>
      ) : (
        // PLACEHOLDER — cuando no hay video aún
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white text-center min-h-48 flex flex-col items-center justify-center gap-4 shadow-xl">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center"
          >
            <Play className="w-10 h-10 text-white fill-white" />
          </motion.div>
          <div>
            <Badge className="bg-orange-400 text-white font-bold mb-2">🎬 Video próximamente</Badge>
            <p className="text-blue-100 font-medium text-sm">
              El video explicativo de este tema estará disponible pronto
            </p>
          </div>
        </div>
      )}

      {/* CONCEPTOS CLAVE */}
      {keyConcepts && keyConcepts.length > 0 && (
        <div className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <p className="font-black text-blue-800">Conceptos clave de esta lección:</p>
          </div>
          <ul className="space-y-2">
            {keyConcepts.map((concept, i) => (
              <li key={i} className="flex items-start gap-2 text-blue-700 font-semibold text-sm">
                <span className="text-blue-400 font-black flex-shrink-0">→</span>
                {concept}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botón continuar */}
      <Button
        onClick={onContinue}
        className="w-full font-black text-xl py-6 rounded-2xl bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
      >
        ¡Entendido! Vamos a practicar
        <ChevronRight className="w-6 h-6 ml-2" />
      </Button>
    </motion.div>
  )
}
