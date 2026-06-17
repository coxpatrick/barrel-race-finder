// ─── Core Data Types ───────────────────────────────────────────────────────────
// NOTE: When connecting to Firebase/Supabase, these interfaces map directly
// to your database schema. Add an 'id' field as the document/row primary key.

export interface BarrelRace {
  id: string;
  name: string;
  date: string;           // ISO date string: "2025-06-14"
  endDate?: string;       // For multi-day events
  city: string;
  state: string;
  stateCode: string;      // Two-letter abbreviation
  arena: string;
  arenaAddress?: string;
  addedMoney: number;     // In USD (0 if no added money)
  entryFee: number;       // Per run in USD
  classes?: string[];     // e.g. ["Open", "4D", "Youth", "Novice"]
  flyerImageUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  isFeatured?: boolean;
  isApproved?: boolean;   // For future approval workflow
  createdAt?: string;     // ISO timestamp
  lat?: number;           // For future Google Maps integration
  lng?: number;
}

// ─── Filter / Search State ─────────────────────────────────────────────────────
export interface EventFilters {
  search: string;
  state: string;
  month: string;
  minAddedMoney: number;
  classes: string[];      // Selected classes to filter by
  maxDistance: number;    // Miles from user location (future feature)
  sortBy: SortOption;
}

export type SortOption = 'date-asc' | 'date-desc' | 'added-money-desc' | 'entry-fee-asc';

// ─── Form Types ────────────────────────────────────────────────────────────────
// NOTE: When adding a backend, POST this to your API endpoint or Firestore collection
export interface EventSubmission {
  name: string;
  date: string;
  endDate?: string;
  city: string;
  state: string;
  stateCode: string;
  arena: string;
  arenaAddress?: string;
  addedMoney: number;
  entryFee: number;
  flyer_url?: string;
  flyerFile?: File | null;
  classes: string[];
  facebookUrl?: string;
  websiteUrl?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
}

// ─── Future: User Account Types ───────────────────────────────────────────────
// TODO: Enable when adding Firebase Auth or Supabase Auth
// export interface User {
//   id: string;
//   email: string;
//   displayName: string;
//   favoriteRaceIds: string[];
//   homeState?: string;
//   homeZip?: string;
//   createdAt: string;
// }

// ─── Future: Race Results ─────────────────────────────────────────────────────
// TODO: Add when implementing results tracking
// export interface RaceResult {
//   id: string;
//   raceId: string;
//   division: string;
//   place: number;
//   riderName: string;
//   horseName: string;
//   time: number; // seconds
//   winnings?: number;
// }

// ─── UI Helper Types ──────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  path: string;
}

export interface StateOption {
  value: string;
  label: string;
}
