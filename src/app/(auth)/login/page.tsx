'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const schema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})
type F = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema) })

  async function onSubmit(data: F) {
    setError(null)
    const { error: err } = await createClient().auth.signInWithPassword({ email: data.email, password: data.password })
    if (err) { setError('Email ou mot de passe incorrect.'); return }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-7">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="text-[#64748B] text-sm mt-1">Content de te revoir 👋</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input {...register('email')} id="email" type="email" label="Email" placeholder="toi@exemple.com" error={errors.email?.message} icon={<Mail className="w-4 h-4" />} autoComplete="email" />
        <div className="relative">
          <Input {...register('password')} id="password" type={showPw ? 'text' : 'password'} label="Mot de passe" placeholder="••••••••" error={errors.password?.message} icon={<Lock className="w-4 h-4" />} autoComplete="current-password" />
          <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-[38px] text-[#64748B] hover:text-[#94A3B8]">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm px-1">{error}</p>}
        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">Se connecter</Button>
      </form>
      <p className="text-center text-sm text-[#64748B] mt-6">
        Pas encore de compte ?{' '}
        <Link href="/signup" className="text-[#A78BFA] hover:text-white transition-colors font-medium">Créer un compte</Link>
      </p>
    </div>
  )
}
