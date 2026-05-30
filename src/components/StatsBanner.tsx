import { sampleEvents } from '../data/events';

export default function StatsBanner() {
  const states = new Set(sampleEvents.map((e) => e.stateCode)).size;
  const totalAdded = sampleEvents.reduce((sum, e) => sum + e.addedMoney, 0);

  const stats = [
    { value: sampleEvents.length.toString(), label: 'Upcoming Races' },
    { value: `${states}`, label: 'States' },
    { value: `$${(totalAdded / 1000).toFixed(0)}K+`, label: 'In Added Money' },
    { value: 'Free', label: 'Always Free to Search' },
  ];

  return (
    <div className="bg-saddle-900 text-white py-10">
      <div className="page-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-white/10">
          {stats.map((s) => (
            <div key={s.label} className="text-center lg:px-8">
              <div className="font-display text-3xl lg:text-4xl font-700 text-saddle-300">
                {s.value}
              </div>
              <div className="font-sans text-sm text-white/60 mt-1 font-400 uppercase tracking-wide">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
