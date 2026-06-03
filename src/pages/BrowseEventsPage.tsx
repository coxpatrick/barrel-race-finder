import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, Search, ArrowUp } from 'lucide-react'
import EventCard from '../components/EventCard'
import FilterPanel from '../components/FilterPanel'
import { SkeletonGrid } from '../components/SkeletonCard'
import { useEventFilters } from '../hooks/useEventFilters'
import { useEvents } from '../hooks/useEvents'
import { US_STATES } from '../data/constants'

export default function BrowseEventsPage() {
  const [searchParams] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [loading, setLoading]                     = useState(true)
  const [showBackToTop, setShowBackToTop]         = useState(false)

const { events, loading: eventsLoading, error: eventsError } = useEvents()

  const {
    filters,
    filteredEvents,
    updateFilter,
    toggleClass,
    resetFilters,
    activeFilterCount,
  } = useEventFilters(events)

// Real loading state comes from useEvents — sync it to local state
  useEffect(() => {
    setLoading(eventsLoading)
  }, [eventsLoading])

  // ── Sync URL params → filters on first mount ───────────────────────────────
  useEffect(() => {
    const q     = searchParams.get('q')
    const state = searchParams.get('state')

    if (q) updateFilter('search', q)

    if (state) {
      if (state.length === 2) {
        updateFilter('state', state.toUpperCase())
      } else {
        const match = US_STATES.find(
          s => s.label.toLowerCase() === state.toLowerCase()
        )
        if (match) updateFilter('state', match.value)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Back to top visibility ─────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // ── Active filter chip labels ──────────────────────────────────────────────
  const activeChips: { key: string; label: string; onRemove: () => void }[] = [
    ...(filters.state
      ? [{
          key: 'state',
          label: US_STATES.find(s => s.value === filters.state)?.label ?? filters.state,
          onRemove: () => updateFilter('state', ''),
        }]
      : []),
    ...(filters.month
      ? [{
          key: 'month',
          label: monthName(filters.month),
          onRemove: () => updateFilter('month', ''),
        }]
      : []),
    ...filters.classes.map(cls => ({
      key: cls,
      label: cls,
      onRemove: () => toggleClass(cls),
    })),
    ...(filters.minAddedMoney > 0
      ? [{
          key: 'money',
          label: `$${filters.minAddedMoney.toLocaleString()}+ added`,
          onRemove: () => updateFilter('minAddedMoney', 0),
        }]
      : []),
  ]

  return (
    <div className="min-h-screen pt-20 pb-16 bg-cream">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="bg-charcoal text-white py-10 lg:py-14">
        <div className="page-container">
          <h1 className="font-display text-3xl md:text-4xl font-700 mb-1">
            Browse Events
          </h1>
          <p className="font-body text-white/60 text-sm md:text-base">
            Find barrel races happening across the United States.
          </p>
        </div>
      </div>

      <div className="page-container mt-6 md:mt-8">

        {/* ── Search + Mobile Filter Toggle ───────────────────────────────── */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4
                               text-dust-400 pointer-events-none" />
            <input
              type="search"
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
              placeholder="Search race name, city, or state…"
              className="input-field pl-11 pr-10 py-3 w-full text-sm md:text-base"
            />
            {filters.search && (
              <button
                onClick={() => updateFilter('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full
                           text-dust-400 hover:text-dust-600 hover:bg-dust-100
                           transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile filter button */}
          <button
            className="lg:hidden relative flex items-center gap-2 px-4 py-3 bg-white
                       border border-dust-200 rounded-xl font-sans text-sm font-500
                       text-charcoal hover:border-saddle-400 transition-colors
                       shadow-sm whitespace-nowrap"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-saddle-600
                               text-white rounded-full flex items-center justify-center
                               text-xs font-700">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Active filter chips — shown on BOTH mobile and desktop ──────── */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {activeChips.map(chip => (
              <Chip
                key={chip.key}
                label={chip.label}
                onRemove={chip.onRemove}
              />
            ))}
            <button
              onClick={resetFilters}
              className="font-sans text-xs text-saddle-600 hover:text-saddle-800
                         underline underline-offset-2 transition-colors self-center"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">

          {/* ── Desktop Filter Sidebar ─────────────────────────────────────── */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                onUpdate={updateFilter}
                onToggleClass={toggleClass}
                onReset={resetFilters}
                activeCount={activeFilterCount}
                resultCount={filteredEvents.length}
              />
            </div>
          </div>

          {/* ── Events Grid ───────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Result bar */}
            {!loading && (
              <div className="flex items-center justify-between mb-5">
                <p className="font-sans text-sm text-dust-500">
                  <strong className="text-charcoal font-600">
                    {filteredEvents.length}
                  </strong>{' '}
                  {filteredEvents.length === 1 ? 'race' : 'races'} found
                  {filters.search && (
                    <span className="text-dust-400">
                      {' '}for &ldquo;
                      <span className="italic">{filters.search}</span>
                      &rdquo;
                    </span>
                  )}
                </p>

                {/* Mobile sort — only visible when not loading */}
                <select
                  value={filters.sortBy}
                  onChange={e =>
                    updateFilter('sortBy', e.target.value as typeof filters.sortBy)
                  }
                  className="lg:hidden text-sm border border-dust-200 rounded-lg
                             px-3 py-1.5 bg-white font-sans text-charcoal
                             focus:outline-none focus:ring-2 focus:ring-saddle-400"
                >
                  <option value="date-asc">Soonest First</option>
                  <option value="date-desc">Latest First</option>
                  <option value="added-money-desc">Most Added Money</option>
                  <option value="entry-fee-asc">Lowest Entry Fee</option>
                </select>
              </div>
            )}

            {/* ── Loading state ──────────────────────────────────────────── */}
            {loading && (
              <div>
                <div className="h-5 w-32 bg-dust-200 animate-pulse rounded mb-5" />
                <SkeletonGrid count={6} />
              </div>
            )}

{/* ── Error state ────────────────────────────────────────────── */}
            {!loading && eventsError && (
              <div className="text-center py-20 bg-white rounded-2xl
                              border border-dust-100 px-6">
                <div className="text-5xl mb-4">⚠️</div>
                <h3 className="font-display text-xl font-700 text-charcoal mb-2">
                  Couldn't load races
                </h3>
                <p className="font-body text-dust-500 mb-6 max-w-sm mx-auto">
                  {eventsError}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            )}

{/* ── Error state ────────────────────────────────────────────── */}
            {!loading && eventsError && (
              <div className="text-center py-20 bg-white rounded-2xl
                              border border-dust-100 px-6">
                <div className="text-5xl mb-4">⚠️</div>
                <h3 className="font-display text-xl font-700 text-charcoal mb-2">
                  Couldn't load races
                </h3>
                <p className="font-body text-dust-500 mb-6 max-w-sm mx-auto">
                  {eventsError}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* ── Empty state ────────────────────────────────────────────── */}
            {!loading && !eventsError && filteredEvents.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl
                              border border-dust-100 px-6">
                <div className="text-5xl mb-4">🐎</div>
                <h3 className="font-display text-xl font-700 text-charcoal mb-2">
                  No races found
                </h3>
                <p className="font-body text-dust-500 mb-2 max-w-sm mx-auto">
                  {filters.search
                    ? `No results for "${filters.search}". Try a different city, state, or race name.`
                    : 'Try adjusting your filters to see more events.'
                  }
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* ── Results grid ───────────────────────────────────────────── */}
            {!loading && !eventsError && filteredEvents.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredEvents.map((event, i) => (
                    <div
                      key={event.id}
                      className="animate-fade-up opacity-0-init"
                      style={{
                        animationFillMode: 'forwards',
                        animationDelay: `${Math.min(i * 40, 300)}ms`,
                      }}
                    >
                      <EventCard event={event} featured={event.isFeatured} />
                    </div>
                  ))}
                </div>

                <p className="text-center font-sans text-xs text-dust-400 mt-10">
                  Showing all {filteredEvents.length} results · More events added weekly
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ─────────────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-cream
                        rounded-t-3xl shadow-2xl flex flex-col"
            style={{ maxHeight: '88vh' }}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4
                            border-b border-dust-100 flex-shrink-0">
              <h2 className="font-display text-xl font-700">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-dust-100 rounded-full transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5">
              <FilterPanel
                filters={filters}
                onUpdate={updateFilter}
                onToggleClass={toggleClass}
                onReset={resetFilters}
                activeCount={activeFilterCount}
                resultCount={filteredEvents.length}
              />
            </div>

            <div className="p-5 border-t border-dust-100 flex-shrink-0 bg-white">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full btn-primary justify-center py-4 text-base"
              >
                Show {filteredEvents.length}{' '}
                {filteredEvents.length === 1 ? 'Race' : 'Races'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Back to top button ───────────────────────────────────────────────── */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-saddle-600
                     hover:bg-saddle-500 text-white rounded-full shadow-lg
                     flex items-center justify-center transition-all duration-200
                     hover:shadow-xl hover:-translate-y-0.5 animate-fade-in"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-saddle-100
                     text-saddle-800 rounded-full font-sans text-xs font-600
                     max-w-[180px]">
      <span className="truncate">{label}</span>
      <button
        onClick={onRemove}
        className="w-4 h-4 rounded-full bg-saddle-200 hover:bg-saddle-300
                   flex items-center justify-center transition-colors flex-shrink-0"
        aria-label={`Remove ${label} filter`}
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  )
}

function monthName(num: string): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return months[parseInt(num, 10) - 1] ?? num
}