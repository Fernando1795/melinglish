/**
 * Seed script — pobla la base de datos de Melinglish con todo el contenido A1
 * Ejecutar: npx tsx scripts/seed.ts
 */
import { createClient } from '@supabase/supabase-js'
import { DEMO_LEVELS } from '../lib/demo-data'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Faltan variables de entorno. Crea .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function seed() {
  console.log('🌱 Iniciando seed de Melinglish...\n')

  for (const level of DEMO_LEVELS) {
    console.log(`📚 Nivel ${level.id}: ${level.title}`)

    let cumulativeMinutes = 0   // para calcular cumulative_hours de cada lección

    for (let modIdx = 0; modIdx < level.modules.length; modIdx++) {
      const mod = level.modules[modIdx]
      console.log(`  📦 Módulo ${modIdx + 1}: ${mod.title}`)

      // Insertar módulo
      const { data: dbMod, error: modErr } = await supabase
        .from('modules')
        .insert({
          level_id:    level.id,
          title:       mod.title,
          description: mod.description,
          order_index: modIdx + 1,
        })
        .select('id')
        .single()

      if (modErr || !dbMod) {
        console.error(`    ❌ Error en módulo: ${modErr?.message}`)
        continue
      }

      for (let secIdx = 0; secIdx < mod.sections.length; secIdx++) {
        const sec = mod.sections[secIdx]

        // Insertar sección
        const { data: dbSec, error: secErr } = await supabase
          .from('sections')
          .insert({
            module_id:   dbMod.id,
            title:       sec.title,
            order_index: secIdx + 1,
          })
          .select('id')
          .single()

        if (secErr || !dbSec) {
          console.error(`    ❌ Error en sección: ${secErr?.message}`)
          continue
        }

        for (let lesIdx = 0; lesIdx < sec.lessons.length; lesIdx++) {
          const les = sec.lessons[lesIdx]
          cumulativeMinutes += les.duration_minutes
          const cumulativeHours = Math.round((cumulativeMinutes / 60) * 100) / 100

          // Insertar lección
          const { data: dbLes, error: lesErr } = await supabase
            .from('lessons')
            .insert({
              section_id:       dbSec.id,
              title:            les.title,
              duration_minutes: les.duration_minutes,
              cumulative_hours: cumulativeHours,
              order_index:      lesIdx + 1,
              is_published:     true,
            })
            .select('id')
            .single()

          if (lesErr || !dbLes) {
            console.error(`    ❌ Error en lección "${les.title}": ${lesErr?.message}`)
            continue
          }

          // Insertar ejercicios (lesson_blocks)
          if (les.exercises.length > 0) {
            const blocks = les.exercises.map((ex, exIdx) => ({
              lesson_id:   dbLes.id,
              type:        ex.type,
              content:     ex.content,
              difficulty:  ex.difficulty,
              order_index: exIdx + 1,
            }))

            const { error: blkErr } = await supabase
              .from('lesson_blocks')
              .insert(blocks)

            if (blkErr) {
              console.error(`    ❌ Error en ejercicios de "${les.title}": ${blkErr.message}`)
            } else {
              console.log(`    ✅ "${les.title}" — ${les.exercises.length} ejercicios · ${cumulativeHours}h acumuladas`)
            }
          }
        }
      }
    }
  }

  // Resumen final
  const { data: counts } = await supabase.rpc('seed_count').single().catch(() => ({ data: null }))
  const { count: modCount  } = await supabase.from('modules').select('*', { count: 'exact', head: true })
  const { count: lesCount  } = await supabase.from('lessons').select('*', { count: 'exact', head: true })
  const { count: blkCount  } = await supabase.from('lesson_blocks').select('*', { count: 'exact', head: true })

  console.log('\n✅ Seed completado:')
  console.log(`   Módulos:   ${modCount}`)
  console.log(`   Lecciones: ${lesCount}`)
  console.log(`   Ejercicios: ${blkCount}`)
}

seed().catch(console.error)
