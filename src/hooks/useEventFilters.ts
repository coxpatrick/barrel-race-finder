import { useState, useMemo } from 'react'
import { BarrelRace, EventFilters } from '../types'
import { filterEvents, sortEvents } from '../utils/helpers'

export const DEFAULT_FILTERS: EventFilters = {
  search: '',
  state: '',
  month: '',
  minAddedMoney: 0,
  maxDistance: 0,
  sortBy: 'date-asc',
  classes: [],
}

export function useEventFilters(events: BarrelRace[]) {
  const [filters, setFilters] = useState<EventFilters>(DEFAULT_FILTERS)

  const filteredEvents = useMemo(() => {
    const filtered = filterEvents(events, filters)
    return sortEvents(filtered, filters.sortBy)
  }, [events, filters])

  const updateFilter = <K extends keyof EventFilters>(key: K, value: EventFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleClass = (cls: string) => {
    setFilters(prev => ({
      ...prev,
      classes: prev.classes.includes(cls)
        ? prev.classes.filter(c => c !== cls)
        : [...prev.classes, cls],
    }))
  }

  const resetFilters = () => setFilters(DEFAULT_FILTERS)

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.state) count++
    if (filters.month) count++
    if (filters.minAddedMoney > 0) count++
    if (filters.classes.length > 0) count++
    return count
  }, [filters])

  return {
    filters,
    filteredEvents,
    updateFilter,
    toggleClass,
    resetFilters,
    activeFilterCount,
  }
}