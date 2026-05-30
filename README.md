# 🐎 Barrel Race Finder

**The #1 platform for barrel racers to find upcoming events across the United States.**

> Find barrel races anywhere — search, filter, and discover events without scrolling through Facebook groups or relying on word-of-mouth.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

---

## 🗂️ Project Structure

```
barrel-race-finder/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.tsx      # Fixed top navigation
│   │   ├── Footer.tsx      # Site footer
│   │   ├── EventCard.tsx   # Card used in event grids
│   │   ├── SearchBar.tsx   # Reusable search input
│   │   ├── FilterPanel.tsx # Filters sidebar / mobile drawer
│   │   └── StatsBanner.tsx # Stats strip on homepage
│   │
│   ├── pages/              # Route-level page components
│   │   ├── HomePage.tsx         # / (Hero, featured events, CTAs)
│   │   ├── BrowseEventsPage.tsx # /events (grid + filters)
│   │   ├── EventDetailPage.tsx  # /events/:id (full event info)
│   │   ├── SubmitEventPage.tsx  # /submit (event submission form)
│   │   └── AboutPage.tsx        # /about
│   │
│   ├── data/
│   │   ├── events.ts       # 18 sample barrel race events
│   │   └── constants.ts    # US states, months, sort options
│   │
│   ├── hooks/
│   │   └── useEventFilters.ts  # Filter/search/sort logic
│   │
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces (BarrelRace, EventFilters, etc.)
│   │
│   ├── utils/
│   │   └── helpers.ts      # formatMoney, filterEvents, sortEvents, etc.
│   │
│   ├── App.tsx             # Router setup
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles + Tailwind
│
├── tailwind.config.js      # Custom western color palette + fonts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 Design System

### Color Palette

| Name      | Purpose                          |
|-----------|----------------------------------|
| `saddle`  | Primary brand color (brown/rust) |
| `dust`    | Neutral grays / muted text       |
| `mesa`    | Accent orange-red                |
| `prairie` | Success green                    |
| `cream`   | Page background                  |
| `charcoal`| Dark UI elements / nav           |

### Typography

- **Display**: Playfair Display (headings, hero text)
- **Body**: Source Serif 4 (body paragraphs)
- **UI**: DM Sans (buttons, labels, nav)

---

## 🔧 Tech Stack

| Tech             | Version  | Purpose                    |
|------------------|----------|----------------------------|
| React            | 18       | UI framework               |
| TypeScript       | 5        | Type safety                |
| Tailwind CSS     | 3        | Utility-first styling      |
| React Router     | 6        | Client-side routing        |
| Lucide React     | Latest   | Icon library               |
| Vite             | 5        | Build tool / dev server    |

---

## 🔌 Adding a Real Backend

### Option A: Firebase (Firestore)

1. Install: `npm install firebase`
2. Create `src/lib/firebase.ts`:
   ```ts
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';
   
   const app = initializeApp({ /* your config */ });
   export const db = getFirestore(app);
   ```
3. Replace mock data in `src/data/events.ts` with Firestore queries.
4. Connect `SubmitEventPage.tsx` form submission to `addDoc(collection(db, 'events'), ...)`.

### Option B: Supabase

1. Install: `npm install @supabase/supabase-js`
2. Create `src/lib/supabase.ts`:
   ```ts
   import { createClient } from '@supabase/supabase-js';
   export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
   ```
3. Create a `events` table matching the `BarrelRace` interface.
4. Replace mock data with `supabase.from('events').select('*')` calls.

### Database Schema (matches `BarrelRace` type)

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date DATE NOT NULL,
  end_date DATE,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  state_code CHAR(2) NOT NULL,
  arena TEXT NOT NULL,
  arena_address TEXT,
  added_money INTEGER DEFAULT 0,
  entry_fee INTEGER NOT NULL,
  classes TEXT[],
  flyer_image_url TEXT,
  facebook_url TEXT,
  website_url TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  notes TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  lat DECIMAL,
  lng DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🗺️ Future Features Roadmap

All TODOs are marked in source code with `// TODO:` comments.

- [ ] **User Accounts** — Firebase Auth or Supabase Auth
- [ ] **Save Favorite Races** — Requires user auth + favorites table
- [ ] **AI Flyer Reader** — Upload flyer → AI extracts event details automatically
- [ ] **Event Approval Workflow** — Admin dashboard for reviewing submissions
- [ ] **Race Results Tracking** — Post-event results and leaderboards
- [ ] **Google Maps Integration** — Real map embeds on event detail pages
- [ ] **Push Notifications** — Notify riders of new races in their state
- [ ] **Distance Filter** — Find races within X miles of rider's location
- [ ] **Mobile App** — React Native or Expo version
- [ ] **Email Notifications** — Weekly digest of new races by state

---

## 📦 Build for Production

```bash
npm run build
# Output: dist/
```

---

## 📝 Adding Real Events

Edit `src/data/events.ts` to add more sample events before connecting a database.
Each event follows the `BarrelRace` interface in `src/types/index.ts`.

---

## 📄 License

MIT — free to use and build upon.
