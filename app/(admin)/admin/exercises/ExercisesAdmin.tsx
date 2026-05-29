'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { type ExerciseType } from '@/lib/exercise-engine'
import { Trash2, Plus } from 'lucide-react'

type Lesson = { id: string; title: string; sections: { title: string; modules: { title: string }[] }[] }
type Exercise = { id: string; lesson_id: string; type: string; content: Record<string, unknown>; difficulty: number; order_index: number }

type Props = { lessons: Lesson[]; exercises: Exercise[] }

const typeLabels: Record<ExerciseType, string> = {
  multiple_choice: '✅ Opción múltiple',
  fill_blank: '✏️ Completar oración',
  sentence_order: '🔤 Ordenar palabras',
}

export default function ExercisesAdmin({ lessons, exercises }: Props) {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [type, setType] = useState<ExerciseType>('multiple_choice')
  const [difficulty, setDifficulty] = useState<number>(1)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [localExercises, setLocalExercises] = useState(exercises)
  const [msg, setMsg] = useState('')

  const filteredExercises = localExercises.filter(e => !selectedLesson || e.lesson_id === selectedLesson!)

  async function handleSave() {
    if (!selectedLesson || !content) return
    setSaving(true)
    setMsg('')
    try {
      const parsedContent = JSON.parse(content)
      const supabase = createClient()
      const { data, error } = await supabase.from('lesson_blocks').insert({
        lesson_id: selectedLesson!,
        type,
        content: parsedContent,
        difficulty,
        order_index: filteredExercises.length + 1,
      }).select().single()

      if (error) throw error
      setLocalExercises([...localExercises, data])
      setContent('')
      setMsg('✅ Ejercicio guardado')
    } catch {
      setMsg('❌ Error: verifica que el JSON sea válido')
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('lesson_blocks').delete().eq('id', id)
    setLocalExercises(localExercises.filter(e => e.id !== id))
  }

  const templates: Record<ExerciseType, string> = {
    multiple_choice: JSON.stringify({
      question: 'Which verb is correct? "She ___ a dog."',
      options: ['have', 'has', 'is', 'are'],
      correct: 'has',
      explanation: '"Has" es la forma correcta para she/he/it',
    }, null, 2),
    fill_blank: JSON.stringify({
      sentence: 'She ___ to school every day.',
      answer: 'goes',
      hint: 'verbo "to go" en tercera persona',
    }, null, 2),
    sentence_order: JSON.stringify({
      words: ['playing', 'is', 'He', 'football'],
      correct_order: ['He', 'is', 'playing', 'football'],
    }, null, 2),
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-gray-900">Ejercicios 📝</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-black text-gray-800">Agregar ejercicio</h2>

          <div className="space-y-2">
            <Label className="font-bold">Lección</Label>
            <Select value={selectedLesson} onValueChange={setSelectedLesson}>
              <SelectTrigger className="rounded-xl border-2">
                <SelectValue placeholder="Selecciona una lección" />
              </SelectTrigger>
              <SelectContent>
                {lessons.map(l => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold">Tipo</Label>
              <Select value={type} onValueChange={v => { setType(v as ExerciseType); setContent(templates[v as ExerciseType]) }}>
                <SelectTrigger className="rounded-xl border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Dificultad</Label>
              <Select value={difficulty.toString()} onValueChange={v => setDifficulty(Number(v))}>
                <SelectTrigger className="rounded-xl border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">⭐ Fácil</SelectItem>
                  <SelectItem value="2">⭐⭐ Medio</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="font-bold">Contenido (JSON)</Label>
              <button
                onClick={() => setContent(templates[type])}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Usar plantilla
              </button>
            </div>
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={10}
              className="font-mono text-sm rounded-xl border-2"
              placeholder="Pega aquí el JSON del ejercicio..."
            />
          </div>

          {msg && (
            <p className={`font-bold text-sm ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {msg}
            </p>
          )}

          <Button
            onClick={handleSave}
            disabled={saving || !selectedLesson || !content.trim()}
            className="w-full font-black rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {saving ? 'Guardando...' : 'Agregar ejercicio'}
          </Button>
        </div>

        {/* Lista de ejercicios */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <h2 className="text-xl font-black text-gray-800 mb-4">
            Ejercicios ({filteredExercises.length})
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredExercises.map(ex => (
              <div key={ex.id} className="border border-gray-100 rounded-xl p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 mb-1 flex-wrap">
                    <Badge className="text-xs font-bold bg-blue-100 text-blue-700">
                      {typeLabels[ex.type as ExerciseType]}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-bold">
                      {'⭐'.repeat(ex.difficulty)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 font-medium truncate">
                    {(ex.content as { question?: string; sentence?: string; words?: string[] }).question
                      || (ex.content as { sentence?: string }).sentence
                      || ((ex.content as { words?: string[] }).words ?? []).join(' ')}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(ex.id)}
                  className="text-red-400 hover:text-red-600 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {filteredExercises.length === 0 && (
              <p className="text-center text-gray-400 font-medium py-8">
                No hay ejercicios aún. ¡Agrega el primero!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
