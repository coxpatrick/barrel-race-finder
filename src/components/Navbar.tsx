import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, MapPin, User, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { label: 'Home',          path: '/' },
  { label: 'Browse Events', path: '/events' },
  { label: 'Submit Event',  path: '/submit' },
  { label: 'About',         path: '/about' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const docH    = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(scrollY > 20)
      setScrollProgress(docH > 0 ? Math.min((scrollY / docH) * 100, 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
    setScrollProgress(0)
  }, [location])

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navBg = isHome
    ? scrolled
      ? 'bg-charcoal/95 backdrop-blur-md shadow-lg'
      : 'bg-transparent'
    : 'bg-charcoal shadow-md'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="page-container">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <img
  src="/Barrel Bay Logo Main.jpg/Barrel Bay Logo Main.jpg"
  alt="Barrel Bay Logo"
  className="h-14 w-auto rounded-md"
/>
              <div className="flex flex-col leading-none">
                <span className="font-display text-white font-bold text-lg tracking-tight">
                  Barrel Bay
                </span>
                <span className="font-sans text-saddle-400 text-[10px] font-semibold
                                 tracking-[0.2em] uppercase">
                  Events
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(item => {
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 rounded-lg font-sans text-sm
                                font-medium transition-all duration-150
                      ${active
                        ? 'text-white bg-white/15'
                        : 'text-white/75 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2
                                       w-1 h-1 bg-saddle-400 rounded-full" />
                    )}
                  </Link>
                )
              })}

              {/* Auth area */}
              {user ? (
                <div className="relative ml-3">
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10
                               hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <div className="w-7 h-7 bg-saddle-500 rounded-full flex items-center
                                    justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-sans text-sm text-white font-medium max-w-[100px]
                                     truncate">
                      {profile?.display_name ?? 'Account'}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white
                                    rounded-xl shadow-xl border border-dust-100
                                    overflow-hidden z-50 animate-fade-in">
                      <Link to="/account"
                        className="flex items-center gap-2.5 px-4 py-3 font-sans text-sm
                                   text-charcoal hover:bg-dust-50 transition-colors">
                        <User className="w-4 h-4 text-dust-400" />
                        My Account
                      </Link>
                      {profile?.is_admin && (
                        <Link to="/admin"
                          className="flex items-center gap-2.5 px-4 py-3 font-sans text-sm
                                     text-charcoal hover:bg-dust-50 transition-colors">
                          <Shield className="w-4 h-4 text-dust-400" />
                          Admin
                        </Link>
                      )}
                      <div className="border-t border-dust-100" />
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-3 font-sans
                                   text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-3">
                  <Link
                    to="/auth"
                    className="px-4 py-2 font-sans text-sm font-medium text-white/80
                               hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth"
                    className="px-4 py-2 bg-saddle-500 hover:bg-saddle-400 text-white
                               font-sans text-sm font-semibold rounded-lg transition-colors
                               shadow-md"
                  >
                    + List Your Race
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Scroll progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
          <div
            className="h-full bg-saddle-400 transition-all duration-100"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 animate-fade-in">
            <div className="bg-charcoal/98 backdrop-blur-md">
              <div className="page-container py-3 flex flex-col gap-1">

                {user && (
                  <div className="flex items-center gap-3 px-4 py-3 mb-1
                                  border-b border-white/10">
                    <div className="w-9 h-9 bg-saddle-500 rounded-full flex items-center
                                    justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-sm font-semibold text-white truncate">
                        {profile?.display_name ?? 'Rider'}
                      </p>
                      <p className="font-sans text-xs text-white/50 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                {NAV_ITEMS.map(item => {
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans
                                  text-base font-medium transition-all duration-150 relative
                        ${active
                          ? 'text-white bg-white/10'
                          : 'text-white/75 hover:text-white hover:bg-white/8'
                        }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px]
                                         bg-saddle-400 rounded-full" />
                      )}
                      <span className={active ? 'ml-2' : ''}>{item.label}</span>
                      {active && (
                        <span className="ml-auto badge bg-saddle-500/30 text-saddle-300 text-xs">
                          Current
                        </span>
                      )}
                    </Link>
                  )
                })}

                {user ? (
                  <>
                    <Link to="/account"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-sans
                                 text-base font-medium text-white/75 hover:text-white
                                 hover:bg-white/8 transition-colors">
                      <User className="w-4 h-4" /> My Account
                    </Link>
                    {profile?.is_admin && (
                      <Link to="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-sans
                                   text-base font-medium text-white/75 hover:text-white
                                   hover:bg-white/8 transition-colors">
                        <Shield className="w-4 h-4" /> Admin
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-sans
                                 text-base font-medium text-red-400 hover:bg-red-900/20
                                 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="mt-2 px-4 py-3.5 bg-saddle-500 hover:bg-saddle-400
                               text-white font-sans font-semibold rounded-xl text-center
                               transition-colors shadow-md"
                  >
                    Sign In / Create Account
                  </Link>
                )}

                <p className="text-center font-sans text-xs text-white/25 py-2">
                  Barrel Bay · Free to use
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop for user menu and mobile menu */}
      {(mobileOpen || userMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setMobileOpen(false); setUserMenuOpen(false) }}
          aria-hidden="true"
        />
      )}
    </>
  )
}