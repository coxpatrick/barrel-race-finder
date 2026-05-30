import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home',          path: '/' },
  { label: 'Browse Events', path: '/events' },
  { label: 'Submit Event',  path: '/submit' },
  { label: 'About',         path: '/about' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location]);

  const navBg = isHome
    ? scrolled
      ? 'bg-charcoal/95 backdrop-blur-md shadow-lg'
      : 'bg-transparent'
    : 'bg-charcoal shadow-md';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-saddle-500 rounded-lg flex items-center justify-center
                            group-hover:bg-saddle-400 transition-colors">
              <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-white font-700 text-lg tracking-tight">
                Barrel Race
              </span>
              <span className="font-sans text-saddle-400 text-xs font-500 tracking-widest uppercase">
                Finder
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-sans text-sm font-500 transition-all duration-150
                    ${active
                      ? 'text-white bg-white/10'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/submit"
              className="ml-4 px-5 py-2 bg-saddle-500 hover:bg-saddle-400 text-white font-sans
                         text-sm font-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              + List Your Race
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-charcoal border-t border-white/10 animate-fade-in">
          <div className="page-container py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 rounded-lg font-sans text-base font-500 transition-colors
                    ${active ? 'text-white bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/submit"
              className="mt-2 px-4 py-3 bg-saddle-500 text-white font-sans font-600 rounded-lg
                         text-center hover:bg-saddle-400 transition-colors"
            >
              + List Your Race
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
