// ─── Database row types ───────────────────────────────────────────────────────
// These match the Supabase table columns exactly.
// The app's BarrelRace interface in types/index.ts maps from these.

export interface DbEvent {
  id:               string
  name:             string
  date:             string
  end_date:         string | null
  city:             string
  state:            string
  state_code:       string
  arena:            string
  arena_address:    string | null
  added_money:      number
  entry_fee:        number
  classes:          string[]
  flyer_image_url:  string | null
  facebook_url:     string | null
  website_url:      string | null
  contact_name:     string | null
  contact_email:    string | null
  contact_phone:    string | null
  notes:            string | null
  is_featured:      boolean
  is_approved:      boolean
  submitted_by:     string | null
  lat:              number | null
  lng:              number | null
  created_at:       string
}

export interface DbProfile {
  id:           string
  email:        string
  display_name: string | null
  home_state:   string | null
  is_admin:     boolean
  created_at:   string
}

export interface DbFavorite {
  id:         string
  user_id:    string
  event_id:   string
  created_at: string
}