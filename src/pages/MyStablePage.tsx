import { Plus, Flag } from 'lucide-react'

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
            <button
              type="button"
              className="btn-secondary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Horse
            </button>

            <button
              type="button"
              className="btn-primary flex items-center gap-2"
            >
              <Flag className="w-4 h-4" />
              Log Run
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-dust-100 shadow-sm p-8">
          <h2 className="font-display text-2xl font-700 text-charcoal">
            My Horses
          </h2>

          <p className="font-body text-dust-500 mt-2">
            Your horses will appear here.
          </p>
        </div>

      </section>
    </div>
  )
}