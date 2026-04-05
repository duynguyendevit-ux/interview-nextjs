'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials')
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    await signIn('google', { callbackUrl })
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-4 pt-20 md:pl-64">
      <div className="max-w-md w-full bg-[#1a1a1a] rounded-sm p-8 border border-white/10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black font-space-grotesk text-[#ff8aa7] mb-2 uppercase">
            Sign In
          </h1>
          <p className="text-[#adaaaa] font-manrope text-sm">
            Access your interview questions and AI projects
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-[#ff8aa7]/10 border border-[#ff8aa7] rounded-sm">
            <p className="text-[#ff8aa7] text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold font-inter uppercase tracking-widest text-[#adaaaa] mb-2">
              Username / Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#20201f] border border-white/10 text-white px-4 py-3 rounded-sm font-manrope focus:outline-none focus:ring-2 focus:ring-[#ff8aa7] focus:border-transparent"
              placeholder="admin"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-inter uppercase tracking-widest text-[#adaaaa] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#20201f] border border-white/10 text-white px-4 py-3 rounded-sm font-manrope focus:outline-none focus:ring-2 focus:ring-[#ff8aa7] focus:border-transparent"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#ff8aa7] to-[#ff6c95] text-black font-bold font-space-grotesk uppercase tracking-wider text-sm rounded-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,138,167,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1a1a1a] px-2 text-[#adaaaa]">Or continue with</span>
          </div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 bg-white text-black font-bold font-space-grotesk text-sm rounded-sm hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-[#adaaaa] text-xs mt-6">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center pt-20 md:pl-64">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
