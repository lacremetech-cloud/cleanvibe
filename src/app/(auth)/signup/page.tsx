'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const schema = z.object({
  username: z.string().min(3, 'Minimum 3 caractères').max(20).regex(/^[a-zA-Z0-9_]+$/, 'Lettres, chiffres et _ uniquement'),
  email:    z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
}).refine((d) => d.password.length >= 8, { message: 'Minimum 8 caractères', path: ['password'] })
type F = z.infer<typeof schema>

export default function SignupPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema) })

  async function onSubmit(data: F) {
    setServerError(null)
    const { error } = await createClient().auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { username: data.username, display_name: data.username }, emailRedirectTo: `${window.location.origin}/home` },
    })
    if (error) { setServerError(error.message); return }
    setSuccess(true)
  }

  if (success) return (
    <div className="w-full max-w-sm text-center">
      <div className="w-12 h-12 rounded-full bg-[#7C3AED]/20 flex items-center justify-center mx-auto mb-4">
        <Mail className="w-5 h-5 text-[#A78BFA]" />
      </div>
      <h2 className="text-xl font-bold mb-2">Vérifie ta boîte mail</h2>
      <p className="text-[#64748B] text-sm">On t'a envoyé un lien de confirmation. Clique dessus pour activer ton compte.</p>
      <Link href="/login" className="inline-block mt-6 text-sm text-[#A78BFA] hover:text-white transition-colors">Retour à la connexion</Link>
    </div>
  )

  return (
    <div className="w-full max-w-sm">
      <div className="mb-7">
        <h1 className="text-2xl font-bold">Créer un compte</h1>
        <p className="text-[#64748B] text-sm mt-1">Gratuit, pour toujours. 🎵</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input {...register('username')} id="username" label="Nom d'utilisateur" placeholder="tonnom" error={errors.username?.message} icon={<User className="w-4 h-4" />} autoComplete="username" />
        <Input {...register('email')} id="email" type="email" label="Email" placeholder="toi@exemple.com" error={errors.email?.message} icon={<Mail className="w-4 h-4" />} autoComplete="email" />
        <div className="relative">
          <Input {...register('password')} id="password" type={showPw ? 'text' : 'password'} label="Mot de passe" placeholder="••••••••" error={errors.password?.message} icon={<Lock className="w-4 h-4" />} autoComplete="new-password" />
          <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-[38px] text-[#64748B] hover:text-[#94A3B8]">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {serverError && <p className="text-red-400 text-sm px-1">{serverError}</p>}
        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">Créer mon compte</Button>
      </form>
      <p className="text-center text-sm text-[#64748B] mt-6">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-[#A78BFA] hover:text-white transition-colors font-medium">Se connecter</Link>
      </p>
    </div>
  )
}
