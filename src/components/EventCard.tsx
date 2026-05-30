import { Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, ExternalLink, ChevronRight } from 'lucide-react';
import { BarrelRace } from '../types';
import { formatMoney, formatShortDate, getAddedMoneyBadgeStyle } from '../utils/helpers';

interface EventCardProps {
  event: BarrelRace;
  featured?: boolean;
}

export default function EventCard({ event, featured = false }: EventCardProps) {
  const d = formatShortDate(event.date);

  return (
    <Link to={`/events/${event.id}`} className="group block">
      <article className={`card h-full flex flex-col transition-all duration-300
        group-hover:-translate-y-1 group-hover:shadow-xl
        ${featured ? 'ring-2 ring-saddle-300' : ''}`}>

        {/* Flyer / Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-dust-100">
          {event.flyerImageUrl ? (
            <img
              src={event.flyerImageUrl}
              alt={`${event.name} flyer`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full hero-gradient flex items-center justify-center">
              <span className="font-display text-white/30 text-5xl">🐎</span>
            </div>
          )}

          {/* Date badge */}
          <div className="absolute top-3 left-3 bg-white rounded-xl shadow-md text-center
                          min-w-[52px] overflow-hidden">
            <div className="bg-saddle-600 px-3 py-0.5">
              <span className="font-sans text-white text-xs font-700 tracking-wider">{d.month}</span>
            </div>
            <div className="px-3 py-1">
              <span className="font-display text-charcoal text-xl font-700 leading-none block">{d.day}</span>
              <span className="font-sans text-dust-500 text-xs">{d.year}</span>
            </div>
          </div>

          {/* Added money badge */}
          <div className={`absolute top-3 right-3 badge shadow-sm ${getAddedMoneyBadgeStyle(event.addedMoney)}`}>
            {event.addedMoney > 0 ? `${formatMoney(event.addedMoney)} Added` : 'Jackpot'}
          </div>

          {featured && (
            <div className="absolute bottom-3 left-3 badge bg-saddle-600 text-white shadow-sm">
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Title */}
          <h3 className="font-display font-700 text-charcoal text-lg leading-snug
                         group-hover:text-saddle-700 transition-colors line-clamp-2">
            {event.name}
          </h3>

          {/* Location */}
          <div className="flex items-start gap-2 text-dust-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-saddle-400" />
            <div className="min-w-0">
              <p className="font-sans text-sm font-500 text-charcoal truncate">
                {event.city}, {event.stateCode}
              </p>
              <p className="font-sans text-xs text-dust-500 truncate">{event.arena}</p>
            </div>
          </div>

          {/* Fee info */}
          <div className="flex items-center gap-2 text-dust-600">
            <DollarSign className="w-4 h-4 flex-shrink-0 text-saddle-400" />
            <span className="font-sans text-sm">
              <strong className="text-charcoal font-600">{formatMoney(event.entryFee)}</strong>
              <span className="text-dust-500"> entry</span>
            </span>
          </div>

          {/* Classes */}
          {event.classes && event.classes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {event.classes.slice(0, 3).map((cls) => (
                <span key={cls} className="badge bg-saddle-50 text-saddle-700 border border-saddle-100">
                  {cls}
                </span>
              ))}
              {event.classes.length > 3 && (
                <span className="badge bg-dust-50 text-dust-500">
                  +{event.classes.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* CTA row */}
          <div className="flex items-center justify-between pt-3 border-t border-dust-100 mt-auto">
            <div className="flex items-center gap-3">
              {event.facebookUrl && (
                <a href={event.facebookUrl} target="_blank" rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 font-sans text-xs text-blue-600 hover:text-blue-800
                             transition-colors font-500">
                  <ExternalLink className="w-3 h-3" />
                  Facebook
                </a>
              )}
              {event.endDate && (
                <span className="font-sans text-xs text-dust-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Multi-day
                </span>
              )}
            </div>
            <span className="flex items-center gap-0.5 font-sans text-xs font-600 text-saddle-600
                             group-hover:gap-1.5 transition-all">
              Details <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
