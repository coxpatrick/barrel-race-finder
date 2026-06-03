import { useState, useEffect } from 'react'
import { BarrelRace } from '../types'
import { fetchApprovedEvents, fetchFeaturedEvents, fetchEventById } from '../lib/api'

// ─── All approved events ───────────────────────────────────────────────────────

export function useEvents() {
  const [events, setEvents]   = useState<BarrelRace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchApprovedEvents()
        if (!cancelled) setEvents(data)
      } catch (e) {
        if (!cancelled) setError('Failed to load events. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { events, loading, error }
}

// ─── Featured events ──────────────────────────────────────────────────────────

export function useFeaturedEvents() {
  const [events, setEvents]   = useState<BarrelRace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchFeaturedEvents()
        if (!cancelled) setEvents(data)
      } catch (e) {
        if (!cancelled) setError('Failed to load featured events.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { events, loading, error }
}

// ─── Single event by ID ───────────────────────────────────────────────────────

export function useEvent(id: string | undefined) {
  const [event, setEvent]     = useState<BarrelRace | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchEventById(id)
        if (!cancelled) setEvent(data)
      } catch (e) {
        if (!cancelled) setError('Failed to load event.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  return { event, loading, error }
}