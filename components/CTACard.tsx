import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Props = {
  title?: string
  subtitle?: string
  primaryBtn?: { label: string; href: string }
  secondaryBtn?: { label: string; href: string }
}

export default function CTACard({
  title = '¿Te gustó? 🎉',
  subtitle = 'Crea tu cuenta y accede a los 8 módulos completos del nivel A1',
  primaryBtn = { label: 'Ver planes', href: '/pricing' },
  secondaryBtn,
}: Props) {
  return (
    <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl p-8 text-white text-center">
      <h3 className="text-2xl font-black mb-2">{title}</h3>
      <p className="text-orange-100 font-medium mb-6">{subtitle}</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link href={primaryBtn.href}>
          <Button className="font-black bg-white text-orange-600 hover:bg-orange-50 rounded-2xl px-10 py-5 text-lg shadow-lg">
            {primaryBtn.label}
          </Button>
        </Link>
        {secondaryBtn && (
          <Link href={secondaryBtn.href}>
            <Button
              variant="outline"
              className="font-black border-2 border-white text-white hover:bg-white/20 rounded-2xl px-8 py-5 text-lg"
            >
              {secondaryBtn.label}
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
