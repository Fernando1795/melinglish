'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, LayoutDashboard, User, LogOut } from 'lucide-react'
import { type Subscription } from '@/lib/content-access'

type Props = {
  userName: string
  subscription: Subscription | null
  isAdmin?: boolean
}

export default function StudentNavbar({ userName, subscription, isAdmin }: Props) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const planLabel = subscription?.plan === 'weekly'
    ? 'Semanal'
    : subscription?.plan === 'monthly'
    ? 'Mensual'
    : subscription?.plan === 'annual'
    ? 'Anual'
    : null

  return (
    <nav className="bg-white border-b-2 border-blue-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/app/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🌟</span>
          <span className="text-xl font-black text-blue-600">Melinglish</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/app/dashboard">
            <Button variant="ghost" size="sm" className="font-bold hidden md:flex">
              <LayoutDashboard className="w-4 h-4 mr-1" />
              Inicio
            </Button>
          </Link>
          <Link href="/app/levels">
            <Button variant="ghost" size="sm" className="font-bold hidden md:flex">
              <BookOpen className="w-4 h-4 mr-1" />
              Niveles
            </Button>
          </Link>
          <Link href="/app/account">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-bold text-sm text-gray-700 hidden md:block">
                {userName.split(' ')[0]}
              </span>
            </div>
          </Link>
          {isAdmin && (
            <Badge className="bg-purple-100 text-purple-700 font-bold hidden sm:block">
              Admin
            </Badge>
          )}
          {!isAdmin && planLabel && (
            <Badge className="bg-orange-100 text-orange-700 font-bold hidden sm:block">
              {planLabel}
            </Badge>
          )}
          {!isAdmin && !subscription && (
            <Link href="/pricing">
              <Button size="sm" className="font-bold bg-orange-500 hover:bg-orange-600 text-white hidden sm:flex">
                ¡Suscríbete!
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-gray-400 hover:text-red-500"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
