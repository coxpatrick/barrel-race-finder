import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import EventCard from '../components/EventCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import { sampleEvents } from '../data/events';
import { useEventFilters } from '../hooks/useEventFilters';

export default function BrowseEventsPage() {
  const [searchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { filters, filteredEvents, updateFilter, resetFilters, activeFilterCount } =
    useEventFilters(sampleEvents);

  // Sync URL params → filters on mount
  useEffect(() => {
    const q     = searchParams.get('q');
    const state = searchParams.get('state');
    if (q)     updateFilter('search', q);
    if (state) {
      // Convert state name to code if needed
      const stateCode = state.length === 2 ? state.toUpperCase() : state;
      updateFilter('state', stateCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="bg-charcoal text-white py-10 lg:py-14">
        <div className="page-container">
          <h1 className="font-display text-3xl md:text-4xl font-700 mb-2">Browse Events</h1>
          <p className="font-body text-white/60">
            Find barrel races happening near you across the United States.
          </p>
        </div>
      </div>

      <div className="page-container mt-8">
        {/* ── Search bar (mobile / top) ─────────────────────────────────── */}
        <div className="mb-6 flex gap-3">
          <SearchBar
            value={filters.search}
            onChange={(v) => updateFilter('search', v)}
            className="flex-1"
          />
          {/* Mobile filter toggle */}
          <button
            className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-dust-200
                       rounded-xl font-sans text-sm font-500 text-charcoal hover:border-saddle-400
                       transition-colors shadow-sm relative"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-saddle-600 text-white rounded-full
                               flex items-center justify-center text-xs font-700">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* ── Desktop Filter Sidebar ────────────────────────────────── */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                onUpdate={updateFilter}
                onReset={resetFilters}
                activeCount={activeFilterCount}
                resultCount={filteredEvents.length}
              />
            </div>
          </div>

          {/* ── Events Grid ───────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Result count + sort (inline on mobile) */}
            <div className="flex items-center justify-between mb-5">
              <p className="font-sans text-sm text-dust-500">
                <strong className="text-charcoal">{filteredEvents.length}</strong>{' '}
                {filteredEvents.length === 1 ? 'race' : 'races'} found
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters}
                    className="ml-2 text-saddle-600 hover:text-saddle-800 underline text-xs transition-colors">
                    Clear filters
                  </button>
                )}
              </p>
              {/* Mobile sort select */}
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as typeof filters.sortBy)}
                className="lg:hidden text-sm border border-dust-200 rounded-lg px-3 py-1.5 bg-white
                           font-sans text-charcoal focus:outline-none focus:ring-2 focus:ring-saddle-400"
              >
                <option value="date-asc">Soonest First</option>
                <option value="date-desc">Latest First</option>
                <option value="added-money-desc">Most Added Money</option>
                <option value="entry-fee-asc">Lowest Entry Fee</option>
              </select>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dust-100">
                <div className="text-5xl mb-4">🐎</div>
                <h3 className="font-display text-xl font-700 text-charcoal mb-2">
                  No races found
                </h3>
                <p className="font-body text-dust-500 mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <button onClick={resetFilters} className="btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredEvents.map((event, i) => (
                  <div
                    key={event.id}
                    className="animate-fade-up opacity-0-init"
                    style={{
                      animationFillMode: 'forwards',
                      animationDelay: `${Math.min(i * 50, 400)}ms`,
                    }}
                  >
                    <EventCard event={event} featured={event.isFeatured} />
                  </div>
                ))}
              </div>
            )}

            {/* TODO: Pagination / infinite scroll when connected to real database */}
            {filteredEvents.length > 0 && (
              <p className="text-center font-sans text-xs text-dust-400 mt-10">
                Showing all {filteredEvents.length} results · More events added weekly
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filters Drawer ─────────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-cream rounded-t-3xl
                          shadow-2xl max-h-[85vh] overflow-y-auto animate-fade-up"
               style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-dust-100">
              <h2 className="font-display text-xl font-700">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-dust-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <FilterPanel
                filters={filters}
                onUpdate={updateFilter}
                onReset={resetFilters}
                activeCount={activeFilterCount}
                resultCount={filteredEvents.length}
              />
            </div>
            <div className="p-5 border-t border-dust-100">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full btn-primary justify-center">
                Show {filteredEvents.length} Races
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
