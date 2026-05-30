import { BarrelRace, EventFilters, SortOption } from '../types';

// ─── Formatters ───────────────────────────────────────────────────────────────

export const formatMoney = (amount: number): string => {
  if (amount === 0) return 'Jackpot';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateRange = (start: string, end?: string): string => {
  const s = new Date(start + 'T00:00:00');
  if (!end) {
    return s.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  const e = new Date(end + 'T00:00:00');
  const startStr = s.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const endStr = e.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' });
  return `${startStr}–${endStr}`;
};

export const formatShortDate = (dateStr: string): { month: string; day: string; year: string } => {
  const date = new Date(dateStr + 'T00:00:00');
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: date.toLocaleDateString('en-US', { day: 'numeric' }),
    year: date.toLocaleDateString('en-US', { year: 'numeric' }),
  };
};

export const getMonthNumber = (dateStr: string): number => {
  return new Date(dateStr + 'T00:00:00').getMonth() + 1;
};

// ─── Filtering & Sorting ──────────────────────────────────────────────────────

export const filterEvents = (events: BarrelRace[], filters: EventFilters): BarrelRace[] => {
  return events.filter((event) => {
    // Search filter (name, city, state, arena)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const searchable = [event.name, event.city, event.state, event.arena, event.stateCode]
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    // State filter
    if (filters.state && event.stateCode !== filters.state) return false;

    // Month filter
    if (filters.month) {
      const eventMonth = getMonthNumber(event.date);
      if (eventMonth !== parseInt(filters.month, 10)) return false;
    }

    // Added money filter
    if (filters.minAddedMoney > 0 && event.addedMoney < filters.minAddedMoney) return false;

    // TODO: Add distance filter when user geolocation is implemented
    // if (filters.maxDistance > 0 && userLat && userLng) { ... }

    return true;
  });
};

export const sortEvents = (events: BarrelRace[], sortBy: SortOption): BarrelRace[] => {
  return [...events].sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'added-money-desc':
        return b.addedMoney - a.addedMoney;
      case 'entry-fee-asc':
        return a.entryFee - b.entryFee;
      default:
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });
};

// ─── Class Badge Colors ────────────────────────────────────────────────────────
export const getClassBadgeStyle = (className: string): string => {
  const lower = className.toLowerCase();
  if (lower.includes('open') || lower.includes('championship')) return 'bg-saddle-100 text-saddle-800';
  if (lower.includes('youth') || lower.includes('junior')) return 'bg-prairie-100 text-prairie-800';
  if (lower.includes('futurity') || lower.includes('derby')) return 'bg-mesa-100 text-mesa-800';
  if (lower.includes('novice') || lower.includes('beginner') || lower.includes('lead line')) return 'bg-blue-100 text-blue-800';
  if (lower.includes('senior')) return 'bg-purple-100 text-purple-800';
  return 'bg-dust-100 text-dust-700';
};

// ─── Added Money Badge ────────────────────────────────────────────────────────
export const getAddedMoneyBadgeStyle = (amount: number): string => {
  if (amount >= 10000) return 'bg-saddle-600 text-white';
  if (amount >= 5000)  return 'bg-saddle-500 text-white';
  if (amount >= 2500)  return 'bg-saddle-400 text-white';
  if (amount > 0)      return 'bg-saddle-200 text-saddle-800';
  return 'bg-dust-100 text-dust-600';
};
