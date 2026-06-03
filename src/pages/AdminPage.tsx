import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield, Check, X, Clock, Eye, MapPin,
  DollarSign, Calendar, ChevronRight, RefreshCw,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchAllEventsAdmin, approveEvent, rejectEvent } from '../lib/api'
import { BarrelRace } from '../types'
import { formatMoney, formatShortDate } from '../utils/helpers'

type FilterTab = 'pending' | 'approved' | 'all'

export default function AdminPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [events, setEvents]       = useState<BarrelRace[]>([])
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState<FilterTab>('pending')
  const [actionId, setActionId]   = useState<string | null>(null)
  const [lastAction, setLastAction] = useState<string | null>(null)

  // ── Auth guard ─────────────────────────────────────────────────────────────
useEffect(() => {
  if (authLoading) return
  if (!user) {
    navigate('/auth')
    return
  }
  if (profile && !profile.is_admin) {
    navigate('/')
  }
}, [user, profile, authLoading, navigate])

  // ── Load events ────────────────────────────────────────────────────────────
  const loadEvents = async () => {
    setLoading(true)
    const data = await fetchAllEventsAdmin()
    setEvents(data)
    setLoading(false)
  }

  useEffect(() => {
    if (profile?.is_admin) loadEvents()
  }, [profile])

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleApprove = async (id: string, name: string) => {
    setActionId(id)
    const ok = await approveEvent(id)
    if (ok) {
      setEvents(prev =>
        prev.map(e => e.id === id ? { ...e, isApproved: true } : e)
      )
      setLastAction(`✅ "${name}" approved and now live.`)
    }
    setActionId(null)
  }

  const handleReject = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setActionId(id)
    const ok = await rejectEvent(id)
    if (ok) {
      setEvents(prev => prev.filter(e => e.id !== id))
      setLastAction(`🗑 "${name}" deleted.`)
    }
    setActionId(null)
  }

  // ── Derived lists ──────────────────────────────────────────────────────────
  const pending  = events.filter(e => !e.isApproved)
  const approved = events.filter(e => e.isApproved)

  const displayed =
    tab === 'pending'  ? pending  :
    tab === 'approved' ? approved :
    events

  if (authLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-saddle-200 border-t-saddle-600
                        rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile?.is_admin) return null

  return (
    <div className="min-h-screen pt-20 pb-16 bg-cream">

      {/* Header */}
      <div className="bg-charcoal text-white py-10">
        <div className="page-container flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-saddle-400" />
              <span className="font-sans text-saddle-400 text-sm font-semibold
                               uppercase tracking-wider">
                Admin
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold">Event Dashboard</h1>
            <p className="font-body text-white/60 text-sm mt-1">
              Review and approve submitted barrel races.
            </p>
          </div>
          <button
            onClick={loadEvents}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10
                       hover:bg-white/20 text-white font-sans text-sm font-semibold
                       rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="page-container mt-8">

        {/* Last action toast */}
        {lastAction && (
          <div className="flex items-center justify-between bg-white border
                          border-dust-100 rounded-xl px-5 py-3.5 mb-6 shadow-sm
                          animate-fade-in">
            <p className="font-sans text-sm text-charcoal">{lastAction}</p>
            <button
              onClick={() => setLastAction(null)}
              className="text-dust-400 hover:text-dust-600 transition-colors ml-4"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: 'Pending Review',
              value: pending.length,
              color: 'text-amber-600',
              bg: 'bg-amber-50 border-amber-100',
              icon: <Clock className="w-5 h-5 text-amber-500" />,
            },
            {
              label: 'Live & Approved',
              value: approved.length,
              color: 'text-prairie-700',
              bg: 'bg-prairie-50 border-prairie-100',
              icon: <Check className="w-5 h-5 text-prairie-600" />,
            },
            {
              label: 'Total Submitted',
              value: events.length,
              color: 'text-charcoal',
              bg: 'bg-white border-dust-100',
              icon: <Shield className="w-5 h-5 text-dust-400" />,
            },
          ].map(stat => (
            <div key={stat.label}
              className={`rounded-2xl border p-4 md:p-5 ${stat.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                {stat.icon}
                <span className="font-sans text-xs text-dust-500 font-semibold
                                 uppercase tracking-wide hidden sm:inline">
                  {stat.label}
                </span>
              </div>
              <p className={`font-display text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="font-sans text-xs text-dust-400 mt-0.5 sm:hidden">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-dust-100 rounded-xl p-1 mb-6 w-fit">
          {([
            { key: 'pending',  label: `Pending (${pending.length})` },
            { key: 'approved', label: `Approved (${approved.length})` },
            { key: 'all',      label: `All (${events.length})` },
          ] as { key: FilterTab; label: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg font-sans text-sm font-semibold
                          transition-all duration-200
                ${tab === t.key
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-dust-500 hover:text-charcoal'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Event list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-dust-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dust-100">
            <div className="text-4xl mb-3">
              {tab === 'pending' ? '🎉' : '🐎'}
            </div>
            <h3 className="font-display text-lg font-bold text-charcoal mb-1">
              {tab === 'pending' ? 'All caught up!' : 'Nothing here yet'}
            </h3>
            <p className="font-sans text-sm text-dust-500">
              {tab === 'pending'
                ? 'No events waiting for review.'
                : 'No events in this category yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map(event => (
              <AdminEventRow
                key={event.id}
                event={event}
                actionId={actionId}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Admin Event Row ──────────────────────────────────────────────────────────

interface RowProps {
  event:     BarrelRace
  actionId:  string | null
  onApprove: (id: string, name: string) => void
  onReject:  (id: string, name: string) => void
}

function AdminEventRow({ event, actionId, onApprove, onReject }: RowProps) {
  const d       = formatShortDate(event.date)
  const busy    = actionId === event.id
  const pending = !event.isApproved

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all
      ${pending ? 'border-amber-200' : 'border-dust-100'}`}>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">

        {/* Date strip */}
        <div className="flex-shrink-0 flex sm:flex-col items-center sm:justify-center
                        bg-saddle-700 text-white px-4 py-2 sm:py-4 rounded-xl
                        sm:min-w-[56px] gap-3 sm:gap-0">
          <span className="font-sans text-saddle-300 text-xs font-bold uppercase
                           tracking-widest">
            {d.month}
          </span>
          <span className="font-display text-white text-2xl font-bold leading-none
                           sm:mt-1">
            {d.day}
          </span>
          <span className="font-sans text-saddle-400 text-xs sm:mt-1">{d.year}</span>
        </div>

        {/* Event info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <h3 className="font-display text-lg font-bold text-charcoal leading-snug">
              {event.name}
            </h3>
            {pending ? (
              <span className="badge bg-amber-100 text-amber-800 flex-shrink-0">
                <Clock className="w-3 h-3 mr-1" /> Pending
              </span>
            ) : (
              <span className="badge bg-prairie-100 text-prairie-800 flex-shrink-0">
                <Check className="w-3 h-3 mr-1" /> Live
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
            <span className="flex items-center gap-1 font-sans text-sm text-dust-500">
              <MapPin className="w-3.5 h-3.5 text-saddle-400" />
              {event.city}, {event.state}
            </span>
            <span className="flex items-center gap-1 font-sans text-sm text-dust-500">
              <DollarSign className="w-3.5 h-3.5 text-saddle-400" />
              {formatMoney(event.entryFee)} entry
              {event.addedMoney > 0 && ` · ${formatMoney(event.addedMoney)} added`}
            </span>
            <span className="flex items-center gap-1 font-sans text-sm text-dust-500">
              <Calendar className="w-3.5 h-3.5 text-saddle-400" />
              {event.arena}
            </span>
          </div>

          {event.classes && event.classes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {event.classes.slice(0, 4).map(cls => (
                <span key={cls}
                  className="badge bg-dust-50 text-dust-600 border border-dust-100">
                  {cls}
                </span>
              ))}
              {event.classes.length > 4 && (
                <span className="badge bg-dust-50 text-dust-400 border border-dust-100">
                  +{event.classes.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to={`/events/${event.id}`}
            target="_blank"
            className="p-2.5 border border-dust-200 hover:border-saddle-400
                       rounded-xl text-dust-500 hover:text-saddle-600
                       transition-colors"
            title="Preview event"
          >
            <Eye className="w-4 h-4" />
          </Link>

          {pending && (
            <button
              onClick={() => onApprove(event.id, event.name)}
              disabled={busy}
              title="Approve event"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-prairie-600
                         hover:bg-prairie-500 text-white font-sans text-sm
                         font-semibold rounded-xl transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white
                                 rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Approve</span>
            </button>
          )}

          <button
            onClick={() => onReject(event.id, event.name)}
            disabled={busy}
            title={pending ? 'Delete submission' : 'Remove event'}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white
                       hover:bg-red-50 text-red-600 border border-red-200
                       hover:border-red-400 font-sans text-sm font-semibold
                       rounded-xl transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? (
              <span className="w-4 h-4 border-2 border-red-300 border-t-red-600
                               rounded-full animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {pending ? 'Delete' : 'Remove'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}