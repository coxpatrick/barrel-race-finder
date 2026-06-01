import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import { EventFilters } from '../types'
import { US_STATES, MONTHS, ADDED_MONEY_OPTIONS, SORT_OPTIONS } from '../data/constants'

const CLASS_FILTERS = [
  { value: 'Open',     label: 'Open',     color: 'bg-saddle-100 text-saddle-800 border-saddle-200' },
  { value: '1D',       label: '1D–5D',    color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'Futurity', label: 'Futurity', color: 'bg-mesa-100 text-mesa-800 border-mesa-200' },
  { value: 'Derby',    label: 'Derby',    color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'Youth',    label: 'Youth',    color: 'bg-prairie-100 text-prairie-800 border-prairie-200' },
  { value: 'Junior',   label: 'Junior',   color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'Novice',   label: 'Novice',   color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'Senior',   label: 'Senior',   color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'Amateur',  label: 'Amateur',  color: 'bg-pink-100 text-pink-800 border-pink-200' },
]

interface FilterPanelProps {
  filters: EventFilters
  onUpdate: <K extends keyof EventFilters>(key: K, value: EventFilters[K]) => void
  onToggleClass: (cls: string) => void
  onReset: () => void
  activeCount: number
  resultCount: number
}

export default function FilterPanel({
  filters,
  onUpdate,
  onToggleClass,
  onReset,
  activeCount,
  resultCount,
}: FilterPanelProps) {
  return (
    <aside className="bg-white rounded-2xl border border-dust-100 shadow-sm overflow-hidden">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-dust-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-saddle-500" />
          <h2 className="font-sans font-700 text-charcoal text-sm uppercase tracking-wider">
            Filters
          </h2>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full
                             bg-saddle-600 text-white text-xs font-700">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 font-sans text-xs text-saddle-600
                       hover:text-saddle-800 transition-colors font-500"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all
          </button>
        )}
      </div>

      {/* ── Result count ─────────────────────────────────────────────────── */}
      <div className="px-5 py-3 bg-saddle-50 border-b border-saddle-100">
        <p className="font-sans text-sm text-dust-600">
          <strong className="text-charcoal font-700">{resultCount}</strong>{' '}
          {resultCount === 1 ? 'race' : 'races'} found
        </p>
      </div>

      <div className="p-5 space-y-6">

        {/* ── Sort ─────────────────────────────────────────────────────────── */}
        <div>
          <label className="label">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={e => onUpdate('sortBy', e.target.value as EventFilters['sortBy'])}
            className="input-field text-sm"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="border-t border-dust-100" />

        {/* ── State ────────────────────────────────────────────────────────── */}
        <div>
          <label className="label">State</label>
          <select
            value={filters.state}
            onChange={e => onUpdate('state', e.target.value)}
            className="input-field text-sm"
          >
            <option value="">All States</option>
            {US_STATES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* ── Month ────────────────────────────────────────────────────────── */}
        <div>
          <label className="label">Month</label>
          <select
            value={filters.month}
            onChange={e => onUpdate('month', e.target.value)}
            className="input-field text-sm"
          >
            <option value="">All Months</option>
            {MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="border-t border-dust-100" />

        {/* ── Division / Class ─────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="label mb-0">Division</label>
            {filters.classes.length > 0 && (
              <button
                onClick={() => onUpdate('classes', [])}
                className="font-sans text-xs text-saddle-600 hover:text-saddle-800 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {CLASS_FILTERS.map(cls => {
              const active = filters.classes.includes(cls.value)
              return (
                <button
                  key={cls.value}
                  onClick={() => onToggleClass(cls.value)}
                  className={`px-3 py-1.5 rounded-full font-sans text-xs font-600 border
                              transition-all duration-150 select-none
                    ${active
                      ? 'bg-saddle-600 text-white border-saddle-600 shadow-sm'
                      : `${cls.color} hover:opacity-80`
                    }`}
                >
                  {cls.label}
                </button>
              )
            })}
          </div>
          {filters.classes.length > 0 && (
            <p className="font-sans text-xs text-dust-400 mt-2">
              Showing races with any selected division
            </p>
          )}
        </div>

        <div className="border-t border-dust-100" />

        {/* ── Added Money ──────────────────────────────────────────────────── */}
        <div>
          <label className="label">Added Money</label>
          <div className="space-y-2.5">
            {ADDED_MONEY_OPTIONS.map(opt => {
              const active = filters.minAddedMoney === opt.value
              return (
                <label key={opt.value}
                  className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                  transition-colors flex-shrink-0
                    ${active
                      ? 'border-saddle-600 bg-saddle-600'
                      : 'border-dust-300 group-hover:border-saddle-400'
                    }`}>
                    {active && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <input
                    type="radio"
                    name="addedMoney"
                    value={opt.value}
                    checked={active}
                    onChange={() => onUpdate('minAddedMoney', opt.value)}
                    className="sr-only"
                  />
                  <span className={`font-sans text-sm transition-colors
                    ${active ? 'text-saddle-700 font-600' : 'text-charcoal group-hover:text-saddle-700'}`}>
                    {opt.label}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

      </div>
    </aside>
  )
}