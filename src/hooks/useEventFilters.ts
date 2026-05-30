import { useState, useMemo } from 'react';
import { BarrelRace, EventFilters } from '../types';
import { filterEvents, sortEvents } from '../utils/helpers';

const DEFAULT_FILTERS: EventFilters = {
  search: '',
  state: '',
  month: '',
  minAddedMoney: 0,
  maxDistance: 0,
  sortBy: 'date-asc',
};

export function useEventFilters(events: BarrelRace[]) {
  const [filters, setFilters] = useState<EventFilters>(DEFAULT_FILTERS);

  const filteredEvents = useMemo(() => {
    const filtered = filterEvents(events, filters);
    return sortEvents(filtered, filters.sortBy);
  }, [events, filters]);

  const updateFilter = <K extends keyof EventFilters>(key: K, value: EventFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.state) count++;
    if (filters.month) count++;
    if (filters.minAddedMoney > 0) count++;
    // Distance filter is future
    return count;
  }, [filters]);

  return {
    filters,
    filteredEvents,
    updateFilter,
    resetFilters,
    activeFilterCount,
  };
}
