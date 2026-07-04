// ─── Events Data ──────────────────────────────────────────────────────────────
// Sample data lives here until Firebase/Supabase is connected.
//
// To add a real backend:
//   1. Move sampleEvents to a Firestore collection or Supabase table
//   2. Replace getAllEvents() with an async fetch
//   3. Remove the localStorage layer — that's only for the no-backend MVP
//
// localStorage key used by SubmitEventPage: 'brf_submitted_events'

import { BarrelRace } from '../types'

// ─── Placeholder images ───────────────────────────────────────────────────────

const IMGS = [
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80',
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&q=80',
  'https://images.unsplash.com/photo-1598127969898-f9f7289c06ca?w=600&q=80',
  'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=80',
  'https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?w=600&q=80',
  'https://images.unsplash.com/photo-1548976994-e2c56b62e22f?w=600&q=80',
  'https://images.unsplash.com/photo-1516616370751-86d6bd8b0651?w=600&q=80',
  'https://images.unsplash.com/photo-1622836464462-e7a1cbb9e3b0?w=600&q=80',
]
const img = (i: number) => IMGS[i % IMGS.length]

// ─── Sample events ────────────────────────────────────────────────────────────

export const sampleEvents: BarrelRace[] = []


// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns all events: hardcoded samples + anything the user has submitted
 * via the Submit Event form (stored in localStorage).
 *
 * TODO: Replace with a single async fetch when backend is connected:
 *   export async function getAllEvents(): Promise<BarrelRace[]> {
 *     const { data } = await supabase.from('events').select('*').eq('is_approved', true)
 *     return data ?? []
 *   }
 */
export function getAllEvents(): BarrelRace[] {

  return []
}

export const getFeaturedEvents = (): BarrelRace[] =>
  getAllEvents().filter(e => e.isFeatured).slice(0, 6)

export const getEventById = (id: string): BarrelRace | undefined =>
  getAllEvents().find(e => e.id === id)

export const getUniqueStates = (): { value: string; label: string }[] => {
  const map = new Map<string, string>()
  getAllEvents().forEach(e => map.set(e.stateCode, e.state))
  return Array.from(map.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label))
}