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
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be under 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm:  z.string(),
}).refine((d) => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})
type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { username: data.username, display_name: data.username },
        emailRedirectTo: `${window.location.origin}/home`,
      },
    })
    if (error) {
      setServerError(error.message)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="bg-[#12122A] border border-[#2A2A50] rounded-2xl p-10 shadow-2xl shadow-black/50">
          <div className="w-14 h-14 rounded-full bg-[#7C3AED]/20 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-[#A78BFA]" />
          </div>
          <h2 className="text-xl font-bold mb-2">Check your email</h2>
          <p className="text-[#64748B] text-sm">
            We sent a confirmation link. Click it to activate your account and start listening.
          </p>
          <Link
            href="/login"
            className="inline-block mt-6 text-[#A78BFA] hover:text-[#7C3AED] text-sm font-medium transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#12122A] border border-[#2A2A50] rounded-2xl p-8 shadow-2xl shadow-black/50">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-[#64748B] text-sm">Free forever. Start vibing.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('username')}
            id="username"
            label="Username"
            placeholder="yourname"
            error={errors.username?.message}
            icon={<User className="w-4 h-4" />}
            autoComplete="username"
          />

          <Input
            {...register('email')}
            id="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            error={errors.email?.message}
            icon={<Mail className="w-4 h-4" />}
            autoComplete="email"
          />

          <div className="relative">
            <Input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
              icon={<Lock className="w-4 h-4" />}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-[38px] text-[#64748B] hover:text-[#94A3B8] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Input
            {...register('confirm')}
            id="confirm"
            type="password"
            label="Confirm password"
            placeholder="••••••••"
            error={errors.confirm?.message}
            icon={<Lock className="w-4 h-4" />}
            autoComplete="new-password"
          />

          {serverError && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <Button type="submit" loading={isSubmitting} className="w-full mt-2" size="lg">
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-[#64748B] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#A78BFA] hover:text-[#7C3AED] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
