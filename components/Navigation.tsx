'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

interface NavItem {
  icon: string
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { icon: '📝', label: 'Questions', href: '/' },
  { icon: '💼', label: 'Job-Focused', href: '/job-focused' },
  { icon: '🤖', label: 'AI Projects', href: '/ai-projects' },
  { icon: '➕', label: 'Submit Question', href: '/submit' },
  { icon: '✓', label: 'Admin Portal', href: '/admin' },
]

export default function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false)
      } else {
        // Scrolling up
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const handleLogout = useCallback(() => {
    signOut()
    setShowUserMenu(false)
  }, [])

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-white/5 h-16 px-6 shadow-2xl shadow-[#ff8aa7]/5 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="flex justify-between items-center h-full max-w-[1920px] mx-auto">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-[#ff8aa7] font-space-grotesk">
              Interview Prep
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleSidebar}
              className="md:hidden text-[#adaaaa] hover:text-[#ff8aa7] transition-colors"
            >
              <span className="text-2xl">☰</span>
            </button>
            
            {/* User Avatar / Login */}
            <div className="relative">
              {session ? (
                <>
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="h-8 w-8 rounded-sm bg-[#20201f] border border-white/10 flex items-center justify-center overflow-hidden hover:border-[#ff8aa7] transition-colors"
                  >
                    {session.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm">👤</span>
                    )}
                  </button>
                  
                  {/* User Menu Dropdown */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 top-12 w-64 bg-[#1a1a1a] border border-white/10 rounded-sm shadow-2xl z-50">
                        <div className="p-4 border-b border-white/10">
                          <div className="flex items-center gap-3 mb-2">
                            {session.user?.image ? (
                              <img 
                                src={session.user.image} 
                                alt={session.user.name || 'User'} 
                                className="w-10 h-10 rounded-sm object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-sm bg-[#20201f] flex items-center justify-center">
                                <span className="text-lg">👤</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-bold font-space-grotesk truncate">{session.user?.name}</p>
                              <p className="text-xs text-[#adaaaa] truncate">{session.user?.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <Link 
                            href="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[#adaaaa] hover:text-white hover:bg-white/5 rounded-sm transition-all"
                          >
                            <span>⚙️</span>
                            Admin Panel
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[#ff8aa7] hover:bg-[#ff8aa7]/10 rounded-sm transition-all"
                          >
                            <span>🚪</span>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="h-8 w-8 rounded-sm bg-[#20201f] border border-white/10 flex items-center justify-center overflow-hidden hover:border-[#ff8aa7] transition-colors"
                >
                  <span className="text-sm">👤</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Side Navigation Bar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed left-0 top-0 h-screen w-64 border-r border-white/5 bg-[#0e0e0e] z-[45] transition-transform pt-16`}>
        <div className="flex flex-col h-full pb-6 font-manrope font-medium text-sm">
          {/* Header */}
          <div className="px-6 mb-8 pt-4">
            <h2 className="font-space-grotesk font-bold text-[#ff8aa7] text-lg">The Curator</h2>
            <p className="text-[#adaaaa] text-xs uppercase tracking-widest">Technical Intelligence</p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 px-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300 ${
                    isActive
                      ? 'text-[#ff8aa7] bg-[#ff8aa7]/10 border-r-2 border-[#ff8aa7]'
                      : 'text-[#adaaaa] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  )
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { signIn } = await import('next-auth/react')
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials')
      } else {
        onClose()
        window.location.reload()
      }
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const { signIn } = await import('next-auth/react')
      await signIn('google', { callbackUrl: '/' })
    } catch (err) {
      setError('Google login failed')
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1a1a1a] rounded-sm z-50 p-8 border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black font-space-grotesk text-white uppercase">
            Sign In
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-[#20201f] rounded-sm hover:bg-[#2c2c2c] transition-all text-white text-xl"
          >
            ×
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-[#ff8aa7]/10 border border-[#ff8aa7] rounded-sm">
            <p className="text-[#ff8aa7] text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-[#adaaaa] cursor-pointer">
              <input type="checkbox" className="rounded-sm bg-[#20201f] border-white/10 text-[#ff8aa7] focus:ring-[#ff8aa7]" disabled={loading} />
              Remember me
            </label>
            <a href="#" className="text-[#ff8aa7] hover:text-[#ff6c95] transition-colors">
              Forgot password?
            </a>
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
      </div>
    </>
  )
}
