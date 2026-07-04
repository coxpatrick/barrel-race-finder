import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, MapPin, Calendar, Star, ArrowRight } from 'lucide-react';
import EventCard from '../components/EventCard';
import StatsBanner from '../components/StatsBanner';
import SearchBar from '../components/SearchBar';
import { useFeaturedEvents } from '../hooks/useEvents'
import { SkeletonGrid } from '../components/SkeletonCard'

const HERO_BG = 'https://images.unsplash.com/photo-1622836464462-e7a1cbb9e3b0?w=1600&q=80';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { events: featured, loading: featuredLoading } = useFeaturedEvents()
const spotlightEvent = featured[0]
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/events?q=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/events');
    }
  };

  return (
    <div>
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt="Barrel racing arena"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
          {/* Grain texture overlay */}
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 page-container text-center pt-24 pb-16">

          {/* Tagline chip */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20
                          rounded-full px-4 py-1.5 mb-6 animate-fade-up opacity-0-init"
               style={{ animationFillMode: 'forwards' }}>
            <MapPin className="w-3.5 h-3.5 text-saddle-400" />
            <span className="font-sans text-white/90 text-sm font-500 tracking-wide">
              Trusted by Barrel Racers Nationwide
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-display text-white text-5xl md:text-6xl lg:text-7xl font-900
                         leading-tight mb-6 text-balance animate-fade-up opacity-0-init animate-delay-100"
              style={{ animationFillMode: 'forwards' }}>
            Find Your Next Barrel Race.
            <br />
            <span className="text-saddle-400">Anywhere.</span>
          </h1>

          <p className="font-body text-white/75 text-lg md:text-xl max-w-xl mx-auto mb-10
                        text-balance animate-fade-up opacity-0-init animate-delay-200"
             style={{ animationFillMode: 'forwards' }}>
            Stop scrolling through Facebook groups. Search hundreds of upcoming barrel races
            across the United States in seconds.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch}
            className="max-w-2xl mx-auto animate-fade-up opacity-0-init animate-delay-300"
            style={{ animationFillMode: 'forwards' }}>
            <div className="flex gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by city, state, or race name…"
                  className="w-full bg-white/10 text-white placeholder-white/50 pl-12 pr-4 py-3.5
                             rounded-xl font-sans text-base focus:outline-none focus:ring-2
                             focus:ring-saddle-400 border border-transparent"
                />
              </div>
              <button type="submit"
                className="px-6 py-3.5 bg-saddle-500 hover:bg-saddle-400 text-white font-sans
                           font-600 rounded-xl transition-all duration-200 flex items-center gap-2
                           shadow-lg hover:shadow-xl whitespace-nowrap">
                [ Search Races ]


                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6
                          animate-fade-up opacity-0-init animate-delay-400"
               style={{ animationFillMode: 'forwards' }}>
            <span className="font-sans text-white/50 text-sm">Popular:</span>
            {['Texas', 'Oklahoma', 'Montana', 'Colorado'].map((state) => (
              <button
                key={state}
                onClick={() => navigate(`/events?state=${state}`)}
                className="font-sans text-sm text-saddle-300 hover:text-saddle-200 transition-colors
                           underline underline-offset-2 decoration-saddle-600">
                {state}
              </button>
            ))}
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0,60 L0,30 Q360,0 720,30 Q1080,60 1440,30 L1440,60 Z"
              fill="#FFF8F0" />
          </svg>
        </div>
      </section>
{/* ── Featured Event Spotlight ─────────────────────────────────────── */}
{!featuredLoading && spotlightEvent && (
  <section className="py-12 bg-cream">
    <div className="page-container">
      <div className="relative overflow-hidden rounded-3xl bg-charcoal shadow-xl">
        <div className="absolute inset-0 opacity-30">
          <img
  src={HERO_BG}
  alt="Barrel racing arena"
  className="w-full h-full object-cover"
/>
        </div>

        <div className="absolute inset-0 bg-charcoal/75" />

        <div className="relative z-10 p-6 md:p-10 lg:p-12 text-white">
          <div className="inline-flex items-center gap-2 bg-saddle-500 text-white rounded-full px-4 py-1.5 mb-5">
            <Star className="w-4 h-4 fill-white" />
            <span className="font-sans text-xs font-bold uppercase tracking-wider">
              Featured Event
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-bold max-w-3xl leading-tight mb-4">
            {spotlightEvent.name}
          </h2>

          <div className="flex flex-wrap gap-4 text-white/80 font-sans text-sm md:text-base mb-6">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-saddle-300" />
              {new Date(spotlightEvent.date).toLocaleDateString()}
            </span>

            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-saddle-300" />
              {spotlightEvent.city}, {spotlightEvent.state}
            </span>

            {spotlightEvent.addedMoney > 0 && (
              <span className="flex items-center gap-2">
                💰 ${spotlightEvent.addedMoney.toLocaleString()} added
              </span>
            )}
          </div>

          <button
            onClick={() => navigate(`/events/${spotlightEvent.id}`)}
            className="btn-primary text-base px-6 py-3"
          >
            View Featured Race
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </section>
)}
      {/* ── Stats Banner ──────────────────────────────────────────────────── */}
      <StatsBanner />

      {/* ── Featured Events ──────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-saddle-500 fill-saddle-400" />
                <span className="font-sans text-saddle-600 font-600 text-sm uppercase tracking-wider">
                  Featured
                </span>
              </div>
              <h2 className="section-title">Upcoming Races</h2>
              <p className="font-body text-dust-500 mt-2">
                Don't miss these highlighted events across the country.
              </p>
            </div>
            <button
              onClick={() => navigate('/events')}
              className="hidden md:flex items-center gap-1.5 font-sans text-saddle-600 font-600
                         text-sm hover:text-saddle-800 transition-colors group">
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {featuredLoading ? (
            <SkeletonGrid count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((event, i) => (
                <div
                  key={event.id}
                  className="animate-fade-up opacity-0-init"
                  style={{
                    animationFillMode: 'forwards',
                    animationDelay: `${i * 80}ms`,
                  }}
                >
                  <EventCard event={event} featured />
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
            <button
              onClick={() => navigate('/events')}
              className="btn-primary">
              Browse All Races <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="bg-saddle-50 border-y border-saddle-100 py-16 lg:py-24">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">How It Works</h2>
            <p className="font-body text-dust-500 max-w-md mx-auto">
              Finding your next barrel race has never been easier.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-6 h-6" />,
                step: '01',
                title: 'Search',
                desc: 'Enter your city, state, or race name. Filter by date, added money, and more.',
              },
              {
                icon: <Calendar className="w-6 h-6" />,
                step: '02',
                title: 'Discover',
                desc: 'Browse detailed event info including entry fees, classes, arena, and contacts.',
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                step: '03',
                title: 'Go Ride',
                desc: 'Get directions, save the event link, and head to the arena. See you at the gate!',
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-16 h-16 bg-saddle-600 text-white rounded-2xl flex items-center
                                justify-center mx-auto mb-4 shadow-md group-hover:bg-saddle-500
                                transition-colors">
                  {item.icon}
                </div>
                <div className="font-sans text-xs text-saddle-400 font-700 uppercase tracking-widest mb-2">
                  Step {item.step}
                </div>
                <h3 className="font-display text-xl font-700 text-charcoal mb-2">{item.title}</h3>
                <p className="font-body text-dust-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="bg-charcoal py-16 lg:py-20 relative overflow-hidden">
        {/* Decorative rope pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #cc7f28 0px, #cc7f28 1px, transparent 1px, transparent 20px)`,
          }}
        />
        <div className="page-container relative text-center">
          <h2 className="font-display text-white text-4xl md:text-5xl font-700 mb-4 text-balance">
            Hosting a Barrel Race?
          </h2>
          <p className="font-body text-white/60 text-lg max-w-lg mx-auto mb-8">
            List your event for free and reach thousands of barrel racers searching for their next competition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/submit')}
              className="btn-primary text-base px-8 py-4">
              Submit Your Event Free
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/events')}
              className="btn-secondary text-base px-8 py-4">
              Browse Races
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
