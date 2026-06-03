import { supabase } from './supabase'
import { DbEvent, DbProfile } from '../types/database'
import { BarrelRace } from '../types'

// ─── Mapper: DbEvent → BarrelRace ─────────────────────────────────────────────
// Converts snake_case DB columns to the camelCase interface the app uses.

export function dbEventToBarrelRace(e: DbEvent): BarrelRace {
  return {
    id:             e.id,
    name:           e.name,
    date:           e.date,
    endDate:        e.end_date ?? undefined,
    city:           e.city,
    state:          e.state,
    stateCode:      e.state_code,
    arena:          e.arena,
    arenaAddress:   e.arena_address ?? undefined,
    addedMoney:     e.added_money,
    entryFee:       e.entry_fee,
    classes:        e.classes ?? [],
    flyerImageUrl:  e.flyer_image_url ?? undefined,
    facebookUrl:    e.facebook_url ?? undefined,
    websiteUrl:     e.website_url ?? undefined,
    contactName:    e.contact_name ?? undefined,
    contactEmail:   e.contact_email ?? undefined,
    contactPhone:   e.contact_phone ?? undefined,
    notes:          e.notes ?? undefined,
    isFeatured:     e.is_featured,
    isApproved:     e.is_approved,
    createdAt:      e.created_at,
    lat:            e.lat ?? undefined,
    lng:            e.lng ?? undefined,
  }
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function fetchApprovedEvents(): Promise<BarrelRace[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_approved', true)
    .order('date', { ascending: true })

  if (error) {
    console.error('fetchApprovedEvents error:', error.message)
    return []
  }
  return (data as DbEvent[]).map(dbEventToBarrelRace)
}

export async function fetchFeaturedEvents(): Promise<BarrelRace[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_approved', true)
    .eq('is_featured', true)
    .order('date', { ascending: true })
    .limit(6)

  if (error) {
    console.error('fetchFeaturedEvents error:', error.message)
    return []
  }
  return (data as DbEvent[]).map(dbEventToBarrelRace)
}

export async function fetchEventById(id: string): Promise<BarrelRace | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('fetchEventById error:', error.message)
    return null
  }
  return dbEventToBarrelRace(data as DbEvent)
}

export async function submitEvent(
  event: Omit<DbEvent, 'id' | 'created_at' | 'is_approved' | 'is_featured'>
): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('events')
    .insert([{ ...event, is_approved: false, is_featured: false }])
    .select('id')
    .single()

  if (error) {
    console.error('submitEvent error:', error.message)
    return null
  }
  return data
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function fetchAllEventsAdmin(): Promise<BarrelRace[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('fetchAllEventsAdmin error:', error.message)
    return []
  }
  return (data as DbEvent[]).map(dbEventToBarrelRace)
}

export async function approveEvent(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('events')
    .update({ is_approved: true })
    .eq('id', id)

  if (error) {
    console.error('approveEvent error:', error.message)
    return false
  }
  return true
}

export async function rejectEvent(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('rejectEvent error:', error.message)
    return false
  }
  return true
}

// ─── Favorites ────────────────────────────────────────────────────────────────

export async function fetchUserFavorites(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('event_id')
    .eq('user_id', userId)

  if (error) {
    console.error('fetchUserFavorites error:', error.message)
    return []
  }
  return data.map((f: { event_id: string }) => f.event_id)
}

export async function addFavorite(
  userId: string,
  eventId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('favorites')
    .insert([{ user_id: userId, event_id: eventId }])

  if (error) {
    console.error('addFavorite error:', error.message)
    return false
  }
  return true
}

export async function removeFavorite(
  userId: string,
  eventId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId)

  if (error) {
    console.error('removeFavorite error:', error.message)
    return false
  }
  return true
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function fetchProfile(userId: string): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('fetchProfile error:', error.message)
    return null
  }
  return data as DbProfile
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<DbProfile, 'display_name' | 'home_state'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) {
    console.error('updateProfile error:', error.message)
    return false
  }
  return true
}