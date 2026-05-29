import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role !== 'admin') redirect('/app/dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🌟</span>
          <span className="font-black text-blue-600">Melinglish Admin</span>
        </Link>
        <Link href="/admin/levels" className="font-bold text-gray-600 hover:text-blue-600">Niveles</Link>
        <Link href="/admin/lessons" className="font-bold text-gray-600 hover:text-blue-600">Lecciones</Link>
        <Link href="/admin/exercises" className="font-bold text-gray-600 hover:text-blue-600">Ejercicios</Link>
        <Link href="/admin/users" className="font-bold text-gray-600 hover:text-blue-600">Usuarios</Link>
        <Link href="/app/dashboard" className="ml-auto font-bold text-gray-400 hover:text-blue-600 text-sm">
          → Ver app
        </Link>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
