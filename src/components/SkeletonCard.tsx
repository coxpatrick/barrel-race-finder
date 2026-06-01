// SkeletonCard — animated placeholder shown while events are loading.
// Used in BrowseEventsPage during the simulated (and later real) loading state.
// When Firebase/Supabase is connected, show these while awaiting the async fetch.

interface SkeletonCardProps {
  count?: number
}

// Shimmer base class — pulse animation built into Tailwind
const SHIMMER = 'bg-dust-200 animate-pulse rounded'

export function SkeletonCard() {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden
                    border border-dust-100 shadow-sm">

      {/* ── Image + Date strip row ───────────────────────────────────── */}
      <div className="flex flex-row">

        {/* Date strip */}
        <div className="flex flex-col items-center justify-center bg-dust-100
                        px-3 py-4 min-w-[56px] flex-shrink-0 gap-2">
          <div className={`${SHIMMER} h-3 w-7`} />
          <div className={`${SHIMMER} h-8 w-8`} />
          <div className={`${SHIMMER} h-2.5 w-7`} />
        </div>

        {/* Image area */}
        <div className="flex-1 aspect-[4/3] bg-dust-100 animate-pulse" />
      </div>

      {/* ── Card body ────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Race name — two lines */}
        <div className="space-y-2">
          <div className={`${SHIMMER} h-4 w-full`} />
          <div className={`${SHIMMER} h-4 w-3/4`} />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <div className={`${SHIMMER} h-3.5 w-3.5 rounded-full flex-shrink-0`} />
          <div className="space-y-1.5 flex-1">
            <div className={`${SHIMMER} h-3 w-2/3`} />
            <div className={`${SHIMMER} h-3 w-1/2`} />
          </div>
        </div>

        {/* Division badges */}
        <div className="flex gap-2 mt-auto pt-1">
          <div className={`${SHIMMER} h-5 w-16 rounded-full`} />
          <div className={`${SHIMMER} h-5 w-20 rounded-full`} />
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-2.5
                        border-t border-dust-100 mt-auto">
          <div className={`${SHIMMER} h-3 w-16`} />
          <div className={`${SHIMMER} h-3 w-20`} />
        </div>
      </div>
    </div>
  )
}

// ─── SkeletonGrid ─────────────────────────────────────────────────────────────
// Drop-in replacement for the events grid while loading.
// Default count of 6 fills a 3-column desktop layout cleanly.

export function SkeletonGrid({ count = 6 }: SkeletonCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}