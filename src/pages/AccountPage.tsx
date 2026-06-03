import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, MapPin, Heart, LogOut, Edit2, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchUserFavorites, updateProfile } from '../lib/api'
import { fetchApprovedEvents } from '../lib/api'
import { BarrelRace } from '../types'
import EventCard from '../components/EventCard'
import { US_STATES } from '../data/constants'

export default function AccountPage() {
  const { user, profile, signOut, refreshProfile, loading } = useAuth()
  const navigate = useNavigate()

  const [favorites, setFavorites]       = useState<BarrelRace[]>([])
  const [favLoading, setFavLoading]     = useState(true)
  const [editing, setEditing]           = useState(false)
  const [displayName, setDisplayName]   = useState('')
  const [homeState, setHomeState]       = useState('')
  const [saving, setSaving]             = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) navigate('/auth')
  }, [user, loading, navigate])

  // Load favorite events
  useEffect(() => {
    if (!user) return
    setFavLoading(true)
    fetchUserFavorites(user.id).then(async (ids) => {
      if (ids.length === 0) {
        setFavorites([])
        setFavLoading(false)
        return
      }
      const all = await fetchApprovedEvents()
      setFavorites(all.filter(e => ids.includes(e.id)))
      setFavLoading(false)
    })
  }, [user])

  // Sync edit fields when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? '')
      setHomeState(profile.home_state ?? '')
    }
  }, [profile])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await updateProfile(user.id, {
      display_name: displayName,
      home_state: homeState,
    })
    await refreshProfile()
    setSaving(false)
    setEditing(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-saddle-200 border-t-saddle-600
                        rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !profile) return null

  return (
    <div className="min-h-screen pt-20 pb-16 bg-cream">
      <div className="bg-charcoal text-white py-10">
        <div className="page-container">
          <h1 className="font-display text-3xl font-bold mb-1">My Account</h1>
          <p className="font-body text-white/60 text-sm">
            Manage your profile and saved races.
          </p>
        </div>
      </div>

      <div className="page-container mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Profile sidebar ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="card p-6">

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-saddle-100 rounded-full flex items-center
                                justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-saddle-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold text-charcoal truncate">
                    {profile.display_name ?? 'Rider'}
                  </p>
                  <p className="font-sans text-xs text-dust-500 truncate">
                    {profile.email}
                  </p>
                  {profile.is_admin && (
                    <span className="badge bg-saddle-100 text-saddle-700 mt-1">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              {/* Edit form */}
              {editing ? (
                <div className="space-y-3">
                  <div>
                    <label className="label">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="label">Home State</label>
                    <select
                      value={homeState}
                      onChange={e => setHomeState(e.target.value)}
                      className="input-field text-sm"
                    >
                      <option value="">Select state…</option>
                      {US_STATES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary flex-1 justify-center py-2 text-sm
                                 disabled:opacity-60"
                    >
                      {saving ? (
                        <span className="w-3.5 h-3.5 border-2 border-white/40
                                         border-t-white rounded-full animate-spin" />
                      ) : (
                        <><Check className="w-3.5 h-3.5" /> Save</>
                      )}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="btn-secondary flex-1 justify-center py-2 text-sm"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-sans text-sm text-dust-600">
                    <MapPin className="w-4 h-4 text-saddle-400 flex-shrink-0" />
                    {profile.home_state
                      ? US_STATES.find(s => s.value === profile.home_state)?.label
                      : 'No home state set'}
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5
                               border border-dust-200 rounded-xl font-sans text-sm
                               font-semibold text-dust-600 hover:border-saddle-400
                               hover:text-saddle-600 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* Quick links */}
            <div className="card p-5 space-y-2">
              {profile.is_admin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                             font-sans text-sm font-semibold text-saddle-700
                             hover:bg-saddle-50 transition-colors"
                >
                  Admin Dashboard →
                </Link>
              )}
              <Link
                to="/events"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                           font-sans text-sm text-dust-600 hover:bg-dust-50
                           transition-colors"
              >
                Browse Races
              </Link>
              <Link
                to="/submit"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                           font-sans text-sm text-dust-600 hover:bg-dust-50
                           transition-colors"
              >
                Submit an Event
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl
                           font-sans text-sm text-red-600 hover:bg-red-50
                           transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* ── Favorites ────────────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <Heart className="w-5 h-5 text-saddle-500" />
              <h2 className="font-display text-2xl font-bold text-charcoal">
                Saved Races
              </h2>
              <span className="badge bg-saddle-100 text-saddle-700 ml-1">
                {favorites.length}
              </span>
            </div>

            {favLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[1, 2].map(i => (
                  <div key={i} className="h-64 bg-dust-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl
                              border border-dust-100">
                <Heart className="w-10 h-10 text-dust-200 mx-auto mb-3" />
                <h3 className="font-display text-lg font-bold text-charcoal mb-2">
                  No saved races yet
                </h3>
                <p className="font-body text-dust-500 text-sm mb-5">
                  Browse events and tap the heart icon to save races you want to attend.
                </p>
                <Link to="/events" className="btn-primary">
                  Browse Races
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {favorites.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}