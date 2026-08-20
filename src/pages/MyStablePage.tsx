import { Plus, Flag, Trophy, ChevronRight } from 'lucide-react'

export default function MyStablePage() {
  
  return (
    <div className="min-h-screen bg-cream">
      <section className="page-container py-12 lg:py-16">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <p className="font-sans text-sm font-600 uppercase tracking-wider text-saddle-600 mb-2">
              Barrel Bay
            </p>

            <h1 className="font-display text-4xl md:text-5xl font-800 text-charcoal mb-3">
              My Stable
            </h1>

            <p className="font-body text-dust-500 text-lg max-w-2xl">
              Track your horses, monitor results, and stay connected with your racing circle.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
           <a
  href="/stable/add"
  className="btn-secondary flex items-center gap-2"
>
  <Plus className="w-4 h-4" />
  Add Horse
</a>

            <button
              type="button"
              className="btn-primary flex items-center gap-2"
            >
              <Flag className="w-4 h-4" />
              Log Run
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-dust-100 shadow-sm overflow-hidden">

  <div className="flex items-center justify-between px-6 py-5 border-b border-dust-100">
    <div>
      <h2 className="font-display text-2xl font-700 text-charcoal">
        My Horses
      </h2>
      <p className="font-body text-dust-500 text-sm mt-1">
        Your stable at a glance.
      </p>
    </div>

    <button
      type="button"
      className="font-sans text-sm font-600 text-saddle-600 hover:text-saddle-800"
    >
      View All Horses
    </button>
  </div>

  <div className="p-4 md:p-6">

    <div className="rounded-2xl border border-saddle-200 bg-saddle-50 p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-center gap-5">

        <div className="w-full md:w-32 h-28 rounded-xl bg-dust-100 flex items-center justify-center flex-shrink-0">
          <span className="font-sans text-sm text-dust-400">
            Horse Photo
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-display text-2xl font-700 text-charcoal">
              Dancer
            </h3>

            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2.5 py-1 text-xs font-600">
              <Trophy className="w-3.5 h-3.5" />
              Rank #1
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-4">
            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-dust-400">
                Avg Time
              </p>
              <p className="font-display text-xl font-700 text-charcoal">
                14.667
              </p>
            </div>

            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-dust-400">
                Total Winnings
              </p>
              <p className="font-display text-xl font-700 text-green-700">
                $6,245
              </p>
            </div>

            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-dust-400">
                Races
              </p>
              <p className="font-display text-xl font-700 text-charcoal">
                15
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary flex items-center justify-center gap-2 whitespace-nowrap"
        >
          View Horse
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </div>

  </div>
</div>

      </section>
    </div>
  )
}