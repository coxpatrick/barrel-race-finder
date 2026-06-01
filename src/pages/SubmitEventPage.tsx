import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle, Upload, Info, ChevronRight, Eye, X,
} from 'lucide-react'
import { US_STATES } from '../data/constants'
import { BarrelRace, EventSubmission } from '../types'
import EventCard from '../components/EventCard'

// ─── Constants ────────────────────────────────────────────────────────────────

const AVAILABLE_CLASSES = [
  'Open', '1D–4D', '1D–5D', '2D–4D', '2D–5D',
  'Futurity', 'Derby',
  'Youth 12 & Under', 'Youth 13–17',
  'Junior', 'Novice Rider', 'Novice Horse',
  'Senior 50+', 'Senior 55+',
  'Beginner', 'Lead Line', 'Poles', 'Amateur',
]

const EMPTY_FORM: EventSubmission = {
  name: '', date: '', endDate: '', city: '',
  state: '', stateCode: '', arena: '', arenaAddress: '',
  addedMoney: 0, entryFee: 0, classes: [],
  flyerFile: null, facebookUrl: '', websiteUrl: '',
  contactName: '', contactEmail: '', contactPhone: '', notes: '',
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
// TODO: Replace with Firebase/Supabase insert when backend is ready.
// The key 'brf_submitted_events' stores an array of BarrelRace objects.

export const STORAGE_KEY = 'brf_submitted_events'

export function loadSubmittedEvents(): BarrelRace[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as BarrelRace[]) : []
  } catch {
    return []
  }
}

function saveSubmittedEvent(event: BarrelRace): void {
  const existing = loadSubmittedEvents()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, event]))
}

function formToBarrelRace(form: EventSubmission): BarrelRace {
  return {
    id: `user-${Date.now()}`,
    name: form.name,
    date: form.date,
    endDate: form.endDate || undefined,
    city: form.city,
    state: form.state,
    stateCode: form.stateCode,
    arena: form.arena,
    arenaAddress: form.arenaAddress || undefined,
    addedMoney: Number(form.addedMoney),
    entryFee: Number(form.entryFee),
    classes: form.classes,
    flyerImageUrl: undefined,   // file upload not persisted to localStorage
    facebookUrl: form.facebookUrl || undefined,
    websiteUrl: form.websiteUrl || undefined,
    contactName: form.contactName || undefined,
    contactEmail: form.contactEmail || undefined,
    contactPhone: form.contactPhone || undefined,
    notes: form.notes || undefined,
    isFeatured: false,
    isApproved: false,
    createdAt: new Date().toISOString(),
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

type FormErrors = Partial<Record<keyof EventSubmission, string>>

function validate(form: EventSubmission): FormErrors {
  const e: FormErrors = {}
  if (!form.name.trim())        e.name        = 'Race name is required'
  if (!form.date)               e.date        = 'Date is required'
  if (!form.city.trim())        e.city        = 'City is required'
  if (!form.stateCode)          e.stateCode   = 'State is required'
  if (!form.arena.trim())       e.arena       = 'Arena name is required'
  if (Number(form.entryFee) <= 0) e.entryFee  = 'Entry fee must be greater than $0'
  if (!form.contactName?.trim()) e.contactName = 'Contact name is required'
  if (!form.contactEmail?.trim() && !form.contactPhone?.trim())
    e.contactEmail = 'Provide at least one contact method'
  return e
}

// ─── Component ────────────────────────────────────────────────────────────────

type SubmitStatus = 'idle' | 'submitting' | 'success'

export default function SubmitEventPage() {
  const [form, setForm]             = useState<EventSubmission>(EMPTY_FORM)
  const [errors, setErrors]         = useState<FormErrors>({})
  const [status, setStatus]         = useState<SubmitStatus>('idle')
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null)
  const [showPreview, setShowPreview]   = useState(false)
  const [submittedEvent, setSubmittedEvent] = useState<BarrelRace | null>(null)

  // ── Field helpers ──────────────────────────────────────────────────────────

  const set = <K extends keyof EventSubmission>(key: K, value: EventSubmission[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleStateChange = (code: string) => {
    const found = US_STATES.find(s => s.value === code)
    setForm(prev => ({ ...prev, stateCode: code, state: found?.label ?? '' }))
    if (errors.stateCode) setErrors(prev => ({ ...prev, stateCode: undefined }))
  }

  const toggleClass = (cls: string) => {
    set(
      'classes',
      form.classes.includes(cls)
        ? form.classes.filter(c => c !== cls)
        : [...form.classes, cls]
    )
  }

  const handleFlyerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    set('flyerFile', file)
    setFlyerPreview(file ? URL.createObjectURL(file) : null)
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // Scroll to first error
      const firstKey = Object.keys(errs)[0]
      document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setStatus('submitting')
    // Simulate network delay — remove when wiring to real backend
    await new Promise(r => setTimeout(r, 900))

    const race = formToBarrelRace(form)
    saveSubmittedEvent(race)
    setSubmittedEvent(race)
    setStatus('success')
  }

  // ── Success screen ─────────────────────────────────────────────────────────

  if (status === 'success' && submittedEvent) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-cream">
        <div className="page-container mt-8">
          <div className="max-w-lg mx-auto text-center animate-fade-up">

            <div className="w-20 h-20 bg-prairie-100 rounded-full flex items-center
                            justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-prairie-600" />
            </div>

            <h1 className="font-display text-3xl font-700 text-charcoal mb-3">
              Race Submitted!
            </h1>
            <p className="font-body text-dust-600 mb-2 leading-relaxed">
              <strong>{submittedEvent.name}</strong> has been saved and is now
              visible in the browse list. It's marked as pending review.
            </p>
            <p className="font-sans text-xs text-dust-400 mb-8">
              Saved locally · Visible to you immediately · Pending approval for public listing
            </p>

            {/* Preview the submitted card */}
            <div className="mb-8 text-left">
              <EventCard event={submittedEvent} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/events" className="btn-primary">
                Browse All Races
              </Link>
              <button
                onClick={() => {
                  setForm(EMPTY_FORM)
                  setFlyerPreview(null)
                  setSubmittedEvent(null)
                  setStatus('idle')
                }}
                className="btn-secondary"
              >
                Submit Another Race
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Helpers for rendering ──────────────────────────────────────────────────

  const fieldError = (key: keyof EventSubmission) =>
    errors[key] ? (
      <p className="mt-1.5 font-sans text-xs text-red-600 flex items-center gap-1">
        <Info className="w-3 h-3 flex-shrink-0" />
        {errors[key]}
      </p>
    ) : null

  const inputCls = (key: keyof EventSubmission) =>
    `input-field ${errors[key] ? 'border-red-400 focus:ring-red-400' : ''}`

  // Live preview event built from current form state
  const previewEvent: BarrelRace = formToBarrelRace(form)

  // ── Form ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen pt-20 pb-16 bg-cream">

      {/* Page header */}
      <div className="bg-charcoal text-white py-10 lg:py-14">
        <div className="page-container">
          <h1 className="font-display text-3xl md:text-4xl font-700 mb-1">
            Submit an Event
          </h1>
          <p className="font-body text-white/60 text-sm md:text-base">
            List your barrel race for free. Reach thousands of riders searching for their next event.
          </p>
        </div>
      </div>

      <div className="page-container mt-8">
        <div className="max-w-3xl mx-auto">

          {/* Info banner */}
          <div className="flex items-start gap-3 bg-saddle-50 border border-saddle-200
                          rounded-xl p-4 mb-8">
            <Info className="w-5 h-5 text-saddle-600 flex-shrink-0 mt-0.5" />
            <p className="font-sans text-sm text-saddle-800 leading-relaxed">
              Submissions are saved instantly and visible in the browse list.
              They're marked <strong>pending review</strong> until approved.
              Listing is always free.
            </p>
          </div>

          {/* Live preview toggle */}
          {form.name && (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowPreview(v => !v)}
                className="flex items-center gap-2 font-sans text-sm font-600
                           text-saddle-600 hover:text-saddle-800 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide preview' : 'Preview your listing'}
              </button>

              {showPreview && (
                <div className="mt-4 max-w-sm animate-fade-up">
                  <p className="font-sans text-xs text-dust-400 mb-2 uppercase tracking-wider font-600">
                    Live Preview
                  </p>
                  <EventCard event={previewEvent} />
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* ── Section: Race Info ──────────────────────────────────────── */}
            <Section title="Race Information">

              <div>
                <label htmlFor="name" className="label">Race Name *</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Lone Star Summer Barrel Bash"
                  className={inputCls('name')}
                />
                {fieldError('name')}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="label">Start Date *</label>
                  <input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={e => set('date', e.target.value)}
                    className={inputCls('date')}
                  />
                  {fieldError('date')}
                </div>
                <div>
                  <label htmlFor="endDate" className="label">
                    End Date{' '}
                    <span className="text-dust-400 font-400">(multi-day)</span>
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={form.endDate}
                    min={form.date}
                    onChange={e => set('endDate', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="label">City *</label>
                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    onChange={e => set('city', e.target.value)}
                    placeholder="e.g. Weatherford"
                    className={inputCls('city')}
                  />
                  {fieldError('city')}
                </div>
                <div>
                  <label htmlFor="stateCode" className="label">State *</label>
                  <select
                    id="stateCode"
                    value={form.stateCode}
                    onChange={e => handleStateChange(e.target.value)}
                    className={inputCls('stateCode')}
                  >
                    <option value="">Select state…</option>
                    {US_STATES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  {fieldError('stateCode')}
                </div>
              </div>

              <div>
                <label htmlFor="arena" className="label">Arena / Venue Name *</label>
                <input
                  id="arena"
                  type="text"
                  value={form.arena}
                  onChange={e => set('arena', e.target.value)}
                  placeholder="e.g. Parker County Expo Center"
                  className={inputCls('arena')}
                />
                {fieldError('arena')}
              </div>

              <div>
                <label htmlFor="arenaAddress" className="label">
                  Arena Address{' '}
                  <span className="text-dust-400 font-400">(helps with mapping)</span>
                </label>
                <input
                  id="arenaAddress"
                  type="text"
                  value={form.arenaAddress}
                  onChange={e => set('arenaAddress', e.target.value)}
                  placeholder="e.g. 516 W Main St, Weatherford, TX 76086"
                  className="input-field"
                />
              </div>

            </Section>

            {/* ── Section: Entry & Fees ───────────────────────────────────── */}
            <Section title="Entry & Fees">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="entryFee" className="label">Entry Fee per Run ($) *</label>
                  <input
                    id="entryFee"
                    type="number"
                    min={0}
                    step={5}
                    value={form.entryFee || ''}
                    onChange={e => set('entryFee', Number(e.target.value))}
                    placeholder="60"
                    className={inputCls('entryFee')}
                  />
                  {fieldError('entryFee')}
                </div>
                <div>
                  <label htmlFor="addedMoney" className="label">
                    Added Money ($){' '}
                    <span className="text-dust-400 font-400">(0 = jackpot)</span>
                  </label>
                  <input
                    id="addedMoney"
                    type="number"
                    min={0}
                    step={500}
                    value={form.addedMoney || ''}
                    onChange={e => set('addedMoney', Number(e.target.value))}
                    placeholder="5000"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="label">
                  Divisions / Classes{' '}
                  <span className="text-dust-400 font-400">(select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {AVAILABLE_CLASSES.map(cls => {
                    const selected = form.classes.includes(cls)
                    return (
                      <button
                        type="button"
                        key={cls}
                        onClick={() => toggleClass(cls)}
                        className={`px-3 py-1.5 rounded-full font-sans text-sm font-500
                                    border transition-all duration-150 select-none
                          ${selected
                            ? 'bg-saddle-600 text-white border-saddle-600 shadow-sm'
                            : 'bg-white border-dust-200 text-dust-600 hover:border-saddle-400'
                          }`}
                      >
                        {cls}
                      </button>
                    )
                  })}
                </div>
              </div>

            </Section>

            {/* ── Section: Flyer & Links ──────────────────────────────────── */}
            <Section title="Flyer & Links">

              <div>
                <label className="label">Event Flyer</label>
                <div className={`border-2 border-dashed rounded-xl p-5 transition-colors
                  ${flyerPreview
                    ? 'border-saddle-300 bg-saddle-50'
                    : 'border-dust-200 hover:border-saddle-300 bg-white'
                  }`}>

                  {flyerPreview ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={flyerPreview}
                        alt="Flyer preview"
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm font-600 text-charcoal truncate">
                          {form.flyerFile?.name}
                        </p>
                        <p className="font-sans text-xs text-dust-400 mt-0.5">
                          {form.flyerFile
                            ? `${(form.flyerFile.size / 1024).toFixed(0)} KB`
                            : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          set('flyerFile', null)
                          setFlyerPreview(null)
                        }}
                        className="p-1.5 hover:bg-dust-100 rounded-full transition-colors
                                   text-dust-400 hover:text-dust-600 flex-shrink-0"
                        aria-label="Remove flyer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer py-2">
                      <div className="w-10 h-10 bg-dust-100 rounded-xl flex items-center justify-center">
                        <Upload className="w-5 h-5 text-dust-400" />
                      </div>
                      <p className="font-sans text-sm font-600 text-charcoal">
                        Click to upload flyer
                      </p>
                      <p className="font-sans text-xs text-dust-400">
                        PNG, JPG, PDF up to 10 MB
                      </p>
                      {/* TODO: AI flyer reader — auto-extract event details from uploaded image */}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFlyerChange}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="facebookUrl" className="label">Facebook Event URL</label>
                <input
                  id="facebookUrl"
                  type="url"
                  value={form.facebookUrl}
                  onChange={e => set('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/events/…"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="websiteUrl" className="label">Official Website</label>
                <input
                  id="websiteUrl"
                  type="url"
                  value={form.websiteUrl}
                  onChange={e => set('websiteUrl', e.target.value)}
                  placeholder="https://…"
                  className="input-field"
                />
              </div>

            </Section>

            {/* ── Section: Contact ────────────────────────────────────────── */}
            <Section title="Contact Information">

              <div>
                <label htmlFor="contactName" className="label">Your Name *</label>
                <input
                  id="contactName"
                  type="text"
                  value={form.contactName}
                  onChange={e => set('contactName', e.target.value)}
                  placeholder="First and last name"
                  className={inputCls('contactName')}
                />
                {fieldError('contactName')}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactEmail" className="label">Email</label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={e => set('contactEmail', e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls('contactEmail')}
                  />
                  {fieldError('contactEmail')}
                </div>
                <div>
                  <label htmlFor="contactPhone" className="label">Phone</label>
                  <input
                    id="contactPhone"
                    type="tel"
                    value={form.contactPhone}
                    onChange={e => set('contactPhone', e.target.value)}
                    placeholder="(555) 555-0000"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="label">Additional Notes</label>
                <textarea
                  id="notes"
                  rows={4}
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="Stall reservations, payout structure, camping, entry form link…"
                  className="input-field resize-none"
                />
              </div>

            </Section>

            {/* ── Submit button ───────────────────────────────────────────── */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary justify-center py-4 text-base
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white
                                     rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    Submit Race for Review
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="font-sans text-xs text-dust-400 text-center leading-relaxed">
                By submitting you confirm this is a real upcoming event.
                Submissions are saved locally until backend is connected.
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="card p-5 md:p-7 space-y-5">
      <h2 className="font-display text-xl font-700 text-charcoal pb-4
                     border-b border-dust-100">
        {title}
      </h2>
      {children}
    </section>
  )
}