import { Link } from 'react-router-dom'
import { MapPin, ExternalLink, ChevronRight, Clock } from 'lucide-react'
import { BarrelRace } from '../types'
import { formatMoney, formatShortDate } from '../utils/helpers'

interface EventCardProps {
  event: BarrelRace
  featured?: boolean
}

const MAX_VISIBLE_CLASSES = 2

export default function EventCard({ event, featured = false }: EventCardProps) {
  const d = formatShortDate(event.date)
  const isUserSubmitted = event.id.startsWith('user-')
  const visibleClasses = event.classes?.slice(0, MAX_VISIBLE_CLASSES) ?? []
  const extraClassCount = (event.classes?.length ?? 0) - MAX_VISIBLE_CLASSES

  return (
    <Link to={`/events/${event.id}`} className="group block h-full">
      <article
        className={`
          relative flex flex-col h-full bg-white rounded-2xl overflow-hidden
          border transition-all duration-300
          group-hover:-translate-y-1 group-hover:shadow-xl
          ${featured
            ? 'border-saddle-300 shadow-md'
            : 'border-dust-100 shadow-sm'
          }
        `}
      >

        {/* ── Pending ribbon ───────────────────────────────────────────── */}
        {isUserSubmitted && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20
                          bg-amber-400 text-amber-900 font-sans text-xs font-700
                          px-3 py-0.5 rounded-full shadow-sm whitespace-nowrap">
            ⏳ Pending Review
          </div>
        )}

        {/* ── Featured badge ───────────────────────────────────────────── */}
        {featured && !isUserSubmitted && (
          <div className="absolute top-3 right-3 z-20 badge bg-saddle-600 text-white shadow-sm">
            ⭐ Featured
          </div>
        )}

        {/* ── Image + Date strip row ───────────────────────────────────── */}
        <div className="flex flex-row">

          {/* Date strip — left side */}
          <div className="flex flex-col items-center justify-center bg-saddle-700
                          text-white px-3 py-4 min-w-[56px] flex-shrink-0">
            <span className="font-sans text-saddle-300 text-xs font-700 uppercase tracking-widest leading-none">
              {d.month}
            </span>
            <span className="font-display text-white text-3xl font-900 leading-none mt-1">
              {d.day}
            </span>
            <span className="font-sans text-saddle-400 text-xs leading-none mt-1">
              {d.year}
            </span>
            {event.endDate && (
              <div className="mt-2 flex flex-col items-center">
                <div className="w-px h-3 bg-saddle-500" />
                <Clock className="w-3 h-3 text-saddle-400 mt-1" />
              </div>
            )}
          </div>

          {/* Flyer image */}
          <div className="relative flex-1 aspect-[4/3] bg-dust-100 overflow-hidden">
            {event.flyerImageUrl ? (
              <img
                src={event.flyerImageUrl}
                alt={`${event.name} flyer`}
                className="w-full h-full object-cover transition-transform
                           duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full hero-gradient flex items-center justify-center">
                <span className="text-white/20 text-5xl select-none">🐎</span>
              </div>
            )}

            {/* Added money overlay at bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2
                            flex items-center justify-between
                            bg-gradient-to-t from-black/70 to-transparent">
              <span className={`font-sans font-700 text-sm
                ${event.addedMoney >= 5000
                  ? 'text-saddle-300'
                  : event.addedMoney > 0
                    ? 'text-white'
                    : 'text-white/70'
                }`}>
                {event.addedMoney > 0
                  ? `${formatMoney(event.addedMoney)} Added`
                  : 'Jackpot'
                }
              </span>
              <span className="font-sans text-white/80 text-xs font-500">
                {formatMoney(event.entryFee)} entry
              </span>
            </div>
          </div>
        </div>
        {/* ── Card body ────────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-4 gap-2.5">

          {/* Race name */}
          <h3 className="font-display font-700 text-charcoal text-base leading-snug
                         group-hover:text-saddle-700 transition-colors line-clamp-2">
            {event.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-saddle-400 flex-shrink-0" />
            <div className="min-w-0">
              <span className="font-sans text-sm font-500 text-charcoal truncate block">
                {event.arena}
              </span>
              <span className="font-sans text-xs text-dust-500">
                {event.city}, {event.state}
              </span>
            </div>
          </div>

          {/* Division badges */}
          {event.classes && event.classes.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-1">
              {visibleClasses.map(cls => (
                <span
                  key={cls}
                  className="badge bg-saddle-50 text-saddle-700 border border-saddle-100
                             text-xs px-2 py-0.5"
                >
                  {cls}
                </span>
              ))}
              {extraClassCount > 0 && (
                <span className="badge bg-dust-50 text-dust-500 border border-dust-100
                                 text-xs px-2 py-0.5">
                  +{extraClassCount} more
                </span>
              )}
            </div>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between pt-2.5
                          border-t border-dust-100 mt-auto">

            {/* Facebook link — stopPropagation prevents card navigation */}
            {event.facebookUrl ? (
              <a
                href={event.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 font-sans text-xs text-blue-600
                           hover:text-blue-800 transition-colors font-500"
              >
                <ExternalLink className="w-3 h-3" />
                Facebook
              </a>
            ) : (
              <span />
            )}

            <span className="flex items-center gap-0.5 font-sans text-xs font-700
                             text-saddle-600 group-hover:gap-1.5 transition-all">
              View Details
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </article>
    </Link>
  )
}