import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { EventFilters } from '../types';
import { US_STATES, MONTHS, ADDED_MONEY_OPTIONS, SORT_OPTIONS } from '../data/constants';

interface FilterPanelProps {
  filters: EventFilters;
  onUpdate: <K extends keyof EventFilters>(key: K, value: EventFilters[K]) => void;
  onReset: () => void;
  activeCount: number;
  resultCount: number;
}

export default function FilterPanel({
  filters,
  onUpdate,
  onReset,
  activeCount,
  resultCount,
}: FilterPanelProps) {
  return (
    <aside className="bg-white rounded-2xl border border-dust-100 shadow-sm p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-saddle-500" />
          <h2 className="font-sans font-700 text-charcoal text-sm uppercase tracking-wider">
            Filters
          </h2>
          {activeCount > 0 && (
            <span className="badge bg-saddle-600 text-white">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 font-sans text-xs text-saddle-600
                       hover:text-saddle-800 transition-colors font-500"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="font-sans text-sm text-dust-500">
        <strong className="text-charcoal font-600">{resultCount}</strong>{' '}
        {resultCount === 1 ? 'race' : 'races'} found
      </p>

      {/* Sort */}
      <div>
        <label className="label">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => onUpdate('sortBy', e.target.value as EventFilters['sortBy'])}
          className="input-field text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="border-t border-dust-100" />

      {/* State */}
      <div>
        <label className="label">State</label>
        <select
          value={filters.state}
          onChange={(e) => onUpdate('state', e.target.value)}
          className="input-field text-sm"
        >
          <option value="">All States</option>
          {US_STATES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Month */}
      <div>
        <label className="label">Month</label>
        <select
          value={filters.month}
          onChange={(e) => onUpdate('month', e.target.value)}
          className="input-field text-sm"
        >
          <option value="">All Months</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Added Money */}
      <div>
        <label className="label">Added Money</label>
        <div className="space-y-2">
          {ADDED_MONEY_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                              transition-colors flex-shrink-0
                ${filters.minAddedMoney === opt.value
                  ? 'border-saddle-600 bg-saddle-600'
                  : 'border-dust-300 group-hover:border-saddle-400'
                }`}>
                {filters.minAddedMoney === opt.value && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </div>
              <input
                type="radio"
                name="addedMoney"
                value={opt.value}
                checked={filters.minAddedMoney === opt.value}
                onChange={() => onUpdate('minAddedMoney', opt.value)}
                className="sr-only"
              />
              <span className="font-sans text-sm text-charcoal group-hover:text-saddle-700 transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* TODO: Distance filter — requires user geolocation */}
      {/* 
      <div>
        <label className="label">Distance</label>
        <p className="text-xs text-dust-400 italic">Coming soon — requires location access</p>
      </div> 
      */}

      {/* TODO: Save Favorites — requires user authentication */}
      {/* <button className="w-full btn-secondary text-sm">
        <Star className="w-4 h-4" /> View Saved Races
      </button> */}
    </aside>
  );
}
