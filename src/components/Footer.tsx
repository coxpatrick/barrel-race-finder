import { Link } from 'react-router-dom';
import { MapPin, Facebook, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/70">
      {/* Rope border top decoration */}
      <div className="h-px w-full"
        style={{
          background: 'repeating-linear-gradient(90deg, #cc7f28 0px, #cc7f28 6px, transparent 6px, transparent 10px)',
        }}
      />

      <div className="page-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 bg-saddle-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-white text-xl font-700">Barrel Bay</span>
            </Link>
            <p className="font-body text-sm leading-relaxed max-w-xs text-white/60">
              The easiest way for barrel racers to discover upcoming events across the United States.
              Built for the barrel racing community, by the barrel racing community.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-saddle-500 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="mailto:hello@barrelracefinder.com"
                className="w-9 h-9 bg-white/10 hover:bg-saddle-500 rounded-lg flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-sans font-600 text-white text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Browse Events', path: '/events' },
                { label: 'Submit an Event', path: '/submit' },
                { label: 'About Us', path: '/about' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path}
                    className="font-sans text-sm text-white/60 hover:text-saddle-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h3 className="font-sans font-600 text-white text-sm uppercase tracking-widest mb-4">
              Top States
            </h3>
            <ul className="space-y-2">
              {['Texas', 'Oklahoma', 'Montana', 'Colorado', 'Tennessee'].map((state) => (
                <li key={state}>
                  <Link to={`/events?state=${state}`}
                    className="font-sans text-sm text-white/60 hover:text-saddle-400 transition-colors">
                    {state}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center
                        justify-between gap-4">
          <p className="font-sans text-xs text-white/40">
            © {new Date().getFullYear()} Barrel Bay. All rights reserved.
          </p>
          <p className="font-sans text-xs text-white/40 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-saddle-500 fill-saddle-500" /> for the barrel racing community
          </p>
        </div>
      </div>
    </footer>
  );
}
