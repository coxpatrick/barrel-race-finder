import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { BarrelRace } from '../types'
import {
  Calendar, MapPin, DollarSign, Phone, Mail, ExternalLink,
  Facebook, ArrowLeft, Clock, User, Tag, ChevronRight,
  Share2, AlertCircle,
} from 'lucide-react'
import { useEvent } from '../hooks/useEvents'
import { fetchApprovedEvents } from '../lib/api'
import {
  formatDateRange,
  formatMoney,
  getClassBadgeStyle,
  getAddedMoneyBadgeStyle,
} from '../utils/helpers'
import EventCard from '../components/EventCard'

export default function EventDetailPage() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const { event, loading, error } = useEvent(id)
  const [similar, setSimilar] = useState<BarrelRace[]>([])

  // ── Must be before any early returns ──────────────────────────────────────
  useEffect(() => {
    if (!event) return
    fetchApprovedEvents().then(all => {
      setSimilar(
        all
          .filter(e => e.stateCode === event.stateCode && e.id !== event.id)
          .slice(0, 3)
      )
    })
  }, [event])

  const mapsQuery = encodeURIComponent(
    event?.arenaAddress ?? `${event?.arena}, ${event?.city}, ${event?.state}`
  )
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.name ?? 'Barrel Race',
          text: `${event?.name} — ${event?.city}, ${event?.state}`,
          url: window.location.href,
        })
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-saddle-200 border-t-saddle-600
                          rounded-full animate-spin mx-auto mb-4" />
          <p className="font-sans text-dust-500">Loading race details…</p>
        </div>
      </div>
    )
  }

  // ── 404 / error ────────────────────────────────────────────────────────────
  if (error || !event) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🤠</div>
          <h1 className="font-display text-2xl font-bold mb-2">Race Not Found</h1>
          <p className="font-body text-dust-500 mb-6">
            This event may have been removed or the link is incorrect.
          </p>
          <Link to="/events" className="btn-primary">Browse All Races</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-cream">

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-dust-100">
        <div className="page-container py-3">
          <nav className="flex items-center gap-1.5 font-sans text-sm text-dust-400 flex-wrap">
            <Link to="/" className="hover:text-saddle-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link to="/events" className="hover:text-saddle-600 transition-colors">
              Events
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-charcoal truncate max-w-[180px] sm:max-w-xs">
              {event.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="page-container mt-6 md:mt-8">

        {/* ── Back + Share row ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 font-sans text-sm text-dust-500
                       hover:text-saddle-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to results
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 font-sans text-sm text-dust-500
                       hover:text-saddle-600 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* ── Main two-column layout ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ── Left / Main ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            <div className="card overflow-hidden">
              <div className="relative aspect-[16/7] bg-dust-100">
                {event.flyerImageUrl ? (
                  <img
                    src={event.flyerImageUrl}
                    alt={`${event.name} flyer`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full hero-gradient flex items-center justify-center">
                    <span className="font-display text-white/20 text-8xl select-none">🐎</span>
                  </div>
                )}
                <div className={`absolute top-3 right-3 badge text-sm px-3 py-1.5 shadow-md
                                  ${getAddedMoneyBadgeStyle(event.addedMoney)}`}>
                  {event.addedMoney > 0
                    ? `${formatMoney(event.addedMoney)} Added`
                    : 'Jackpot'}
                </div>
                {event.isFeatured && (
                  <div className="absolute top-3 left-3 badge bg-saddle-600 text-white
                                  text-sm px-3 py-1.5 shadow-md">
                    ⭐ Featured
                  </div>
                )}
              </div>

              <div className="p-5 md:p-7">
                <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold
                               text-charcoal leading-tight mb-5 text-balance">
                  {event.name}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <FactCard
                    icon={<Calendar className="w-5 h-5 text-white" />}
                    label="Date"
                    value={formatDateRange(event.date, event.endDate)}
                    sub={event.endDate ? 'Multi-day event' : undefined}
                    subIcon={<Clock className="w-3 h-3" />}
                  />
                  <FactCard
                    icon={<MapPin className="w-5 h-5 text-white" />}
                    label="Location"
                    value={event.arena}
                    sub={`${event.city}, ${event.state}`}
                  />
                  <FactCard
                    icon={<DollarSign className="w-5 h-5 text-white" />}
                    label="Entry Fee"
                    value={`${formatMoney(event.entryFee)} per run`}
                    sub={`${formatMoney(event.addedMoney)} added money`}
                  />
                  <FactCard
                    icon={<Tag className="w-5 h-5 text-white" />}
                    label="Divisions"
                    value={event.classes?.join(', ') ?? 'See event details'}
                  />
                </div>

                {event.classes && event.classes.length > 0 && (
                  <div className="mb-5">
                    <p className="font-sans text-xs font-semibold text-dust-500
                                  uppercase tracking-wider mb-2">
                      Divisions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {event.classes.map(cls => (
                        <span
                          key={cls}
                          className={`badge text-sm px-3 py-1 ${getClassBadgeStyle(cls)}`}
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {event.notes && (
                  <div className="bg-saddle-50 border border-saddle-100 rounded-xl p-4 md:p-5">
                    <p className="font-sans text-xs font-semibold text-saddle-700
                                  uppercase tracking-wider mb-2">
                      Event Notes
                    </p>
                    <p className="font-body text-sm text-dust-700 leading-relaxed">
                      {event.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Map card */}
            <div className="card p-5 md:p-6">
              <h2 className="font-display text-lg font-bold text-charcoal mb-4
                             flex items-center gap-2">
                <MapPin className="w-5 h-5 text-saddle-500" />
                Venue &amp; Directions
              </h2>
              <div className="w-full h-44 md:h-52 bg-dust-100 rounded-xl border
                              border-dust-200 flex flex-col items-center justify-center
                              gap-3 text-center p-6 mb-4">
                <div className="w-12 h-12 bg-saddle-100 rounded-full flex items-center
                                justify-center">
                  <MapPin className="w-6 h-6 text-saddle-500" />
                </div>
                <div>
                  <p className="font-sans font-semibold text-charcoal text-sm">
                    {event.arena}
                  </p>
                  {event.arenaAddress && (
                    <p className="font-sans text-xs text-dust-500 mt-0.5">
                      {event.arenaAddress}
                    </p>
                  )}
                  <p className="font-sans text-xs text-dust-500">
                    {event.city}, {event.state}
                  </p>
                </div>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-white
                           border-2 border-saddle-300 hover:border-saddle-500
                           text-saddle-700 font-sans font-semibold text-sm
                           rounded-xl transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Get Directions in Google Maps
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* ── Right / Sidebar ──────────────────────────────────────────────── */}
          <div className="space-y-4">

            <div className="card p-5 space-y-3">
              <p className="font-sans text-xs font-semibold text-dust-400
                            uppercase tracking-wider">
                Event Links
              </p>
              {event.facebookUrl && (
                <a
                  href={event.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3
                             bg-[#1877F2] hover:bg-[#166FE5] text-white font-sans
                             font-semibold text-sm rounded-xl transition-colors shadow-sm"
                >
                  <Facebook className="w-4 h-4" />
                  View on Facebook
                </a>
              )}
              {event.websiteUrl && (
                <a
                  href={event.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3
                             bg-white border-2 border-saddle-300 hover:border-saddle-500
                             text-saddle-700 font-sans font-semibold text-sm
                             rounded-xl transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Official Website
                </a>
              )}
              {!event.facebookUrl && !event.websiteUrl && (
                <div className="flex items-center gap-2 text-dust-400 text-sm
                                font-sans py-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  No external links provided
                </div>
              )}
              {/* TODO: Save to Favorites — wired up in next step */}
            </div>

            {(event.contactName || event.contactEmail || event.contactPhone) && (
              <div className="card p-5">
                <p className="font-sans text-xs font-semibold text-dust-400
                              uppercase tracking-wider mb-4">
                  Contact
                </p>
                <div className="space-y-3">
                  {event.contactName && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-saddle-100 rounded-lg flex items-center
                                      justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-saddle-600" />
                      </div>
                      <span className="font-sans text-sm font-medium text-charcoal">
                        {event.contactName}
                      </span>
                    </div>
                  )}
                  {event.contactPhone && (
                    <a href={`tel:${event.contactPhone}`}
                       className="flex items-center gap-3 group">
                      <div className="w-8 h-8 bg-saddle-100 group-hover:bg-saddle-200
                                      rounded-lg flex items-center justify-center
                                      flex-shrink-0 transition-colors">
                        <Phone className="w-4 h-4 text-saddle-600" />
                      </div>
                      <span className="font-sans text-sm text-charcoal
                                       group-hover:text-saddle-700 transition-colors">
                        {event.contactPhone}
                      </span>
                    </a>
                  )}
                  {event.contactEmail && (
                    <a href={`mailto:${event.contactEmail}`}
                       className="flex items-center gap-3 group">
                      <div className="w-8 h-8 bg-saddle-100 group-hover:bg-saddle-200
                                      rounded-lg flex items-center justify-center
                                      flex-shrink-0 transition-colors">
                        <Mail className="w-4 h-4 text-saddle-600" />
                      </div>
                      <span className="font-sans text-sm text-charcoal
                                       group-hover:text-saddle-700 transition-colors
                                       break-all">
                        {event.contactEmail}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="card p-5">
              <p className="font-sans text-xs font-semibold text-dust-400
                            uppercase tracking-wider mb-4">
                Quick Facts
              </p>
              <dl className="space-y-3">
                {[
                  { label: 'State',       value: event.state },
                  { label: 'Arena',       value: event.arena },
                  { label: 'Added Money', value: formatMoney(event.addedMoney) },
                  { label: 'Entry Fee',   value: formatMoney(event.entryFee) },
                  { label: 'Multi-Day',   value: event.endDate ? 'Yes' : 'No' },
                ].map(row => (
                  <div key={row.label}
                    className="flex items-start justify-between gap-4 text-sm font-sans">
                    <dt className="text-dust-500 flex-shrink-0">{row.label}</dt>
                    <dd className="font-semibold text-charcoal text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

          </div>
        </div>

        {/* ── Similar Events ───────────────────────────────────────────────── */}
        {similar.length > 0 && (
          <section className="mt-14 md:mt-16">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal">
                  More Races in {event.state}
                </h2>
                <p className="font-body text-dust-500 text-sm mt-1">
                  Other upcoming events near this one.
                </p>
              </div>
              <Link
                to={`/events?state=${event.stateCode}`}
                className="hidden sm:flex items-center gap-1 font-sans text-sm
                           font-semibold text-saddle-600 hover:text-saddle-800
                           transition-colors"
              >
                View all in {event.stateCode}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map(e => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ─── FactCard ─────────────────────────────────────────────────────────────────

interface FactCardProps {
  icon:     React.ReactNode
  label:    string
  value:    string
  sub?:     string
  subIcon?: React.ReactNode
}

function FactCard({ icon, label, value, sub, subIcon }: FactCardProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-saddle-50 rounded-xl
                    border border-saddle-100">
      <div className="w-9 h-9 bg-saddle-600 rounded-lg flex items-center
                      justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-sans text-xs text-saddle-600 font-semibold
                      uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="font-sans text-sm font-semibold text-charcoal leading-snug">
          {value}
        </p>
        {sub && (
          <p className="font-sans text-xs text-dust-500 mt-0.5 flex items-center gap-1">
            {subIcon}
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}