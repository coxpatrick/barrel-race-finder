import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, DollarSign, Phone, Mail, ExternalLink,
  Facebook, ArrowLeft, Clock, User, ChevronRight, Tag
} from 'lucide-react';
import { getEventById, sampleEvents } from '../data/events';
import { formatDateRange, formatMoney, getClassBadgeStyle, getAddedMoneyBadgeStyle } from '../utils/helpers';
import EventCard from '../components/EventCard';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const event = id ? getEventById(id) : undefined;

  if (!event) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤠</div>
          <h1 className="font-display text-2xl font-700 mb-2">Race Not Found</h1>
          <p className="font-body text-dust-500 mb-6">
            This event may have been removed or the link is incorrect.
          </p>
          <Link to="/events" className="btn-primary">Browse All Races</Link>
        </div>
      </div>
    );
  }

  // Similar events (same state, excluding current)
  const similar = sampleEvents
    .filter((e) => e.stateCode === event.stateCode && e.id !== event.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-dust-100">
        <div className="page-container py-4">
          <div className="flex items-center gap-2 font-sans text-sm text-dust-500">
            <Link to="/" className="hover:text-saddle-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/events" className="hover:text-saddle-600 transition-colors">Events</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-charcoal truncate max-w-[200px]">{event.name}</span>
          </div>
        </div>
      </div>

      <div className="page-container mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main Content ────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 font-sans text-sm text-dust-500
                         hover:text-saddle-600 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to results
            </button>

            {/* Event Hero */}
            <div className="card overflow-hidden">
              {/* Flyer image */}
              <div className="relative aspect-[16/7] bg-dust-100">
                {event.flyerImageUrl ? (
                  <img
                    src={event.flyerImageUrl}
                    alt={`${event.name} flyer`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full hero-gradient flex items-center justify-center">
                    <span className="font-display text-white/30 text-8xl">🐎</span>
                  </div>
                )}
                {/* Added money overlay */}
                <div className={`absolute top-4 right-4 badge text-base px-4 py-2 shadow-lg
                                  ${getAddedMoneyBadgeStyle(event.addedMoney)}`}>
                  {event.addedMoney > 0 ? `${formatMoney(event.addedMoney)} Added` : 'Jackpot'}
                </div>
                {event.isFeatured && (
                  <div className="absolute top-4 left-4 badge bg-saddle-600 text-white text-base px-4 py-2 shadow-lg">
                    ⭐ Featured Event
                  </div>
                )}
              </div>

              <div className="p-6 lg:p-8">
                <h1 className="font-display text-3xl md:text-4xl font-700 text-charcoal mb-4 text-balance">
                  {event.name}
                </h1>

                {/* Key details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Date */}
                  <div className="flex items-start gap-3 p-4 bg-saddle-50 rounded-xl border border-saddle-100">
                    <div className="w-9 h-9 bg-saddle-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-sans text-xs text-saddle-600 font-600 uppercase tracking-wide mb-0.5">
                        Date
                      </div>
                      <div className="font-sans text-sm font-600 text-charcoal">
                        {formatDateRange(event.date, event.endDate)}
                      </div>
                      {event.endDate && (
                        <div className="font-sans text-xs text-dust-500 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Multi-day event
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 p-4 bg-saddle-50 rounded-xl border border-saddle-100">
                    <div className="w-9 h-9 bg-saddle-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-sans text-xs text-saddle-600 font-600 uppercase tracking-wide mb-0.5">
                        Location
                      </div>
                      <div className="font-sans text-sm font-600 text-charcoal">
                        {event.arena}
                      </div>
                      <div className="font-sans text-xs text-dust-500 mt-0.5">
                        {event.city}, {event.state}
                      </div>
                    </div>
                  </div>

                  {/* Entry Fee */}
                  <div className="flex items-start gap-3 p-4 bg-saddle-50 rounded-xl border border-saddle-100">
                    <div className="w-9 h-9 bg-saddle-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-sans text-xs text-saddle-600 font-600 uppercase tracking-wide mb-0.5">
                        Entry Fee
                      </div>
                      <div className="font-sans text-sm font-600 text-charcoal">
                        {formatMoney(event.entryFee)} per run
                      </div>
                      <div className="font-sans text-xs text-dust-500 mt-0.5">
                        {formatMoney(event.addedMoney)} added money
                      </div>
                    </div>
                  </div>

                  {/* Classes */}
                  <div className="flex items-start gap-3 p-4 bg-saddle-50 rounded-xl border border-saddle-100">
                    <div className="w-9 h-9 bg-saddle-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-sans text-xs text-saddle-600 font-600 uppercase tracking-wide mb-1.5">
                        Divisions
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {event.classes?.map((cls) => (
                          <span key={cls} className={`badge ${getClassBadgeStyle(cls)}`}>{cls}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {event.notes && (
                  <div className="bg-dust-50 rounded-xl p-5 border border-dust-100">
                    <h3 className="font-sans font-700 text-charcoal text-sm uppercase tracking-wider mb-3">
                      Event Notes
                    </h3>
                    <p className="font-body text-dust-700 text-sm leading-relaxed">{event.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Google Maps Placeholder ───────────────────────────────── */}
            <div className="card p-6">
              <h2 className="font-display text-xl font-700 text-charcoal mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-saddle-500" /> Venue Location
              </h2>
              {/* TODO: Replace with real Google Maps embed when Google Maps API key is configured */}
              {/* <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(event.arenaAddress || event.arena + ', ' + event.city + ', ' + event.state)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-64 rounded-xl border-0"
                allowFullScreen
                loading="lazy"
              /> */}
              <div className="w-full h-56 bg-dust-100 rounded-xl border border-dust-200 flex flex-col
                              items-center justify-center gap-3 text-center p-6">
                <div className="w-12 h-12 bg-saddle-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-saddle-500" />
                </div>
                <div>
                  <p className="font-sans font-600 text-charcoal text-sm">{event.arena}</p>
                  {event.arenaAddress && (
                    <p className="font-sans text-xs text-dust-500 mt-0.5">{event.arenaAddress}</p>
                  )}
                  <p className="font-sans text-xs text-dust-500">{event.city}, {event.state}</p>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    event.arenaAddress || `${event.arena}, ${event.city}, ${event.state}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-sans text-sm text-saddle-600 font-600
                             hover:text-saddle-800 transition-colors mt-1"
                >
                  Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Action Buttons */}
            <div className="card p-5 space-y-3">
              {event.facebookUrl && (
                <a
                  href={event.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#1877F2]
                             hover:bg-[#166FE5] text-white font-sans font-600 text-sm rounded-xl
                             transition-colors shadow-md">
                  <Facebook className="w-4 h-4" /> View on Facebook
                </a>
              )}
              {event.websiteUrl && (
                <a
                  href={event.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2
                             border-saddle-300 hover:border-saddle-500 text-saddle-700 font-sans
                             font-600 text-sm rounded-xl transition-colors">
                  <ExternalLink className="w-4 h-4" /> Official Website
                </a>
              )}
              {/* TODO: Save to Favorites — requires user auth */}
              {/* <button className="w-full btn-ghost justify-center border border-dust-200 rounded-xl py-3">
                <Star className="w-4 h-4" /> Save to Favorites
              </button> */}
            </div>

            {/* Contact Info */}
            {(event.contactName || event.contactEmail || event.contactPhone) && (
              <div className="card p-5">
                <h3 className="font-sans font-700 text-charcoal text-sm uppercase tracking-wider mb-4">
                  Contact
                </h3>
                <div className="space-y-3">
                  {event.contactName && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-dust-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-dust-500" />
                      </div>
                      <span className="font-sans text-sm text-charcoal">{event.contactName}</span>
                    </div>
                  )}
                  {event.contactPhone && (
                    <a href={`tel:${event.contactPhone}`}
                      className="flex items-center gap-3 hover:text-saddle-600 transition-colors group">
                      <div className="w-8 h-8 bg-dust-100 group-hover:bg-saddle-50 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                        <Phone className="w-4 h-4 text-dust-500 group-hover:text-saddle-500 transition-colors" />
                      </div>
                      <span className="font-sans text-sm text-charcoal group-hover:text-saddle-600 transition-colors">
                        {event.contactPhone}
                      </span>
                    </a>
                  )}
                  {event.contactEmail && (
                    <a href={`mailto:${event.contactEmail}`}
                      className="flex items-center gap-3 hover:text-saddle-600 transition-colors group">
                      <div className="w-8 h-8 bg-dust-100 group-hover:bg-saddle-50 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                        <Mail className="w-4 h-4 text-dust-500 group-hover:text-saddle-500 transition-colors" />
                      </div>
                      <span className="font-sans text-sm text-charcoal group-hover:text-saddle-600 transition-colors truncate">
                        {event.contactEmail}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Event at a Glance */}
            <div className="card p-5">
              <h3 className="font-sans font-700 text-charcoal text-sm uppercase tracking-wider mb-4">
                Quick Facts
              </h3>
              <dl className="space-y-3 font-sans text-sm">
                {[
                  { label: 'State', value: event.state },
                  { label: 'Arena', value: event.arena },
                  { label: 'Added Money', value: formatMoney(event.addedMoney) },
                  { label: 'Entry Fee', value: formatMoney(event.entryFee) },
                  { label: 'Multi-Day', value: event.endDate ? 'Yes' : 'No' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <dt className="text-dust-500">{row.label}</dt>
                    <dd className="font-600 text-charcoal text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* ── Similar Events ───────────────────────────────────────────────── */}
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-2">More Races in {event.state}</h2>
            <p className="font-body text-dust-500 mb-8">Other upcoming barrel races near this event.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
