import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, MapPin } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home',          path: '/' },
  { label: 'Browse Events', path: '/events' },
  { label: 'Submit Event',  path: '/submit' },
  { label: 'About',         path: '/about' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const location = useLocation()
  const isHome = location.pathname === '/'

  // ── Scroll effects ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const scrollY  = window.scrollY
      const docH     = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(scrollY > 20)
      setScrollProgress(docH > 0 ? Math.min((scrollY / docH) * 100, 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Close mobile menu on route change ──────────────────────────────────────
  useEffect(() => {
    setMobileOpen(false)
    // Reset progress bar on navigation
    setScrollProgress(0)
  }, [location])

  // ── Active link helper ─────────────────────────────────────────────────────
  // Exact match for home, prefix match for everything else
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navBg = isHome
    ? scrolled
      ? 'bg-charcoal/95 backdrop-blur-md shadow-lg'
      : 'bg-transparent'
    : 'bg-charcoal shadow-md'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>

        {/* ── Main bar ──────────────────────────────────────────────────── */}
        <div className="page-container">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 bg-saddle-500 rounded-lg flex items-center
                              justify-center group-hover:bg-saddle-400 transition-colors
                              shadow-sm">
                <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-white font-700 text-lg tracking-tight">
                  Barrel Race
                </span>
                <span className="font-sans text-saddle-400 text-[10px] font-600
                                 tracking-[0.2em] uppercase">
                  Finder
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(item => {
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 rounded-lg font-sans text-sm font-500
                                transition-all duration-150
                      ${active
                        ? 'text-white bg-white/15'
                        : 'text-white/75 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {item.label}
                    {/* Active underline dot */}
                    {active && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2
                                       w-1 h-1 bg-saddle-400 rounded-full" />
                    )}
                  </Link>
                )
              })}

              {/* CTA button */}
              <Link
                to="/submit"
                className="ml-3 px-5 py-2 bg-saddle-500 hover:bg-saddle-400 text-white
                           font-sans text-sm font-600 rounded-lg transition-all duration-200
                           shadow-md hover:shadow-lg active:scale-95"
              >
                + List Your Race
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg
                         transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen
                ? <X className="w-6 h-6" />
                : <Menu className="w-6 h-6" />
              }
            </button>
          </div>
        </div>

        {/* ── Scroll progress bar ────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
          <div
            className="h-full bg-saddle-400 transition-all duration-100"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* ── Mobile drawer ─────────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 animate-fade-in">
            <div className="bg-charcoal/98 backdrop-blur-md">
              <div className="page-container py-3 flex flex-col gap-1">
                {NAV_ITEMS.map(item => {
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl
                                  font-sans text-base font-500 transition-all duration-150
                                  relative overflow-hidden
                        ${active
                          ? 'text-white bg-white/10'
                          : 'text-white/75 hover:text-white hover:bg-white/8'
                        }`}
                    >
                      {/* Active left border indicator */}
                      {active && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px]
                                         bg-saddle-400 rounded-full" />
                      )}
                      <span className={active ? 'ml-2' : ''}>
                        {item.label}
                      </span>
                      {active && (
                        <span className="ml-auto badge bg-saddle-500/30
                                         text-saddle-300 text-xs">
                          Current
                        </span>
                      )}
                    </Link>
                  )
                })}

                {/* Mobile CTA */}
                <Link
                  to="/submit"
                  className="mt-2 px-4 py-3.5 bg-saddle-500 hover:bg-saddle-400
                             text-white font-sans font-600 rounded-xl text-center
                             transition-colors shadow-md"
                >
                  + List Your Race
                </Link>

                {/* Mobile nav footer */}
                <p className="text-center font-sans text-xs text-white/25 py-2">
                  Barrel Race Finder · Free to use
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Mobile menu backdrop ───────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}