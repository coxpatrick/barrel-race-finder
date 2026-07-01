import { useEvents } from '../hooks/useEvents'

export default function StatsBanner() {
  const { events, loading } = useEvents()

  const states = new Set(events.map((e) => e.stateCode).filter(Boolean)).size

  const stats = [
    {
      value: loading ? '—' : events.length.toString(),
      label: 'Upcoming Events',
    },
    {
      value: loading ? '—' : states.toString(),
      label: 'States',
    },
    {
      value: '100%',
      label: 'Verified Events',
    },
    {
      value: 'FREE',
      label: 'Event Listings',
    },
  ]

  return (
    <div className="bg-saddle-900 text-white py-10">
      <div className="page-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-white/10">
          {stats.map((s) => (
            <div key={s.label} className="text-center lg:px-8">
              <div className="font-display text-4xl lg:text-5xl font-bold text-saddle-300">
                {s.value}
              </div>
              <div className="font-sans text-sm text-white/70 mt-2 font-semibold uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}