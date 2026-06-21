'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

function GitHubIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = searchParams.get('lang')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
    if (error) { toast.error(error.message) }
    else {
      toast.success('Account created! Check your email.')
      router.push(lang ? `/auth/login?lang=${encodeURIComponent(lang)}` : '/auth/login')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    const supabase = createClient()
    const redirectTo = lang
      ? `${window.location.origin}/auth/callback?lang=${encodeURIComponent(lang)}`
      : `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo },
    })
    if (error) { toast.error(error.message); setGoogleLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', fontFamily: 'var(--font-stack)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <span className="text-white/40">&gt;_</span>
          <span className="font-bold text-sm">CodeItUp</span>
        </Link>
        <p className="text-white/30 text-xs">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-white hover:underline">Sign in</Link>
        </p>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-3">Get started</p>
            <h1 className="text-4xl font-bold tracking-tight mb-3">Create your account</h1>
            <p className="text-white/40 text-sm">Free forever · No credit card needed</p>
            {lang && (
              <div className="mt-4 inline-flex items-center gap-2 border border-white/10 px-3 py-1.5 text-xs text-white/60">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                You&apos;ll start a <span className="text-white font-semibold">{lang}</span> project after signing up
              </div>
            )}
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 text-sm font-semibold py-3.5 transition-colors disabled:opacity-60 mb-6 border border-white/20 hover:border-white/40 hover:bg-white/5"
            style={{ background: '#161b22', color: '#fff' }}
          >
            {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitHubIcon />}
            Continue with GitHub
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/20 text-xs">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-xs uppercase tracking-widest">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                placeholder="Som Pattjoshi"
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-xs uppercase tracking-widest">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-xs uppercase tracking-widest">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/50 transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full text-sm font-bold py-3.5 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 rounded-md"
                style={{ background: 'var(--accent)', color: '#0e0e0e' }}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin text-black" />}
                {loading ? 'Creating account...' : 'Create account →'}
              </button>
            </div>
          </form>

          <p className="text-center text-white/20 text-xs mt-8">
            By signing up you agree to our terms of service.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--bg)' }} />}>
      <RegisterForm />
    </Suspense>
  )
}
