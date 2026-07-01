import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import {
  CheckCircle, Upload, Info, ChevronRight,
  ChevronLeft, Eye, X, Clock, Star, Globe,
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

const NOTES_MAX = 500

const STEPS = [
  { number: 1, label: 'Race Details'    },
  { number: 2, label: 'Fees & Divisions' },
  { number: 3, label: 'Contact & Links' },
]

const EMPTY_FORM: EventSubmission = {
  name: '', date: '', endDate: '', city: '',
  state: '', stateCode: '', arena: '', arenaAddress: '', flyer_url: '',
  addedMoney: 0, entryFee: 0, classes: [],
  flyerFile: null, facebookUrl: '', websiteUrl: '',
  contactName: '', contactEmail: '', contactPhone: '', notes: '',
}

// ─── localStorage helpers ─────────────────────────────────────────────────────





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
    flyerImageUrl: undefined,
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

function validateStep(step: number, form: EventSubmission): FormErrors {
  const e: FormErrors = {}
  if (step === 1) {
    if (!form.name.trim())    e.name    = 'Race name is required'
    if (!form.date)           e.date    = 'Date is required'
    if (!form.city.trim())    e.city    = 'City is required'
    if (!form.stateCode)      e.stateCode = 'State is required'
    if (!form.arena.trim())   e.arena   = 'Arena name is required'
  }
  if (step === 2) {
    if (Number(form.entryFee) <= 0) e.entryFee = 'Entry fee must be greater than $0'
  }
  if (step === 3) {
    if (!form.contactName?.trim()) e.contactName = 'Contact name is required'
    if (!form.contactEmail?.trim() && !form.contactPhone?.trim())
      e.contactEmail = 'Provide at least one contact method'
  }
  return e
}

// ─── Component ────────────────────────────────────────────────────────────────

type SubmitStatus = 'idle' | 'submitting' | 'success'

export default function SubmitEventPage() {
  const { user } = useAuth()
  const [form, setForm]           = useState<EventSubmission>(EMPTY_FORM)
  const [errors, setErrors]       = useState<FormErrors>({})
  const [status, setStatus]       = useState<SubmitStatus>('idle')
  const [currentStep, setCurrentStep] = useState(1)
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
    set('classes',
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

  // ── Step navigation ────────────────────────────────────────────────────────

  const goNext = () => {
    const errs = validateStep(currentStep, form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstKey = Object.keys(errs)[0]
      document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setErrors({})
    setCurrentStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    setErrors({})
    setCurrentStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

const handleSubmit = async (e: React.FormEvent) => {
console.log('Submit clicked')
console.log('Flyer file:', form.flyerFile)
    e.preventDefault()
    const errs = validateStep(3, form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setStatus('submitting')
let flyerUrl = form.flyer_url || null

if (form.flyerFile) {
  const fileExt = form.flyerFile.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
  const filePath = `${user?.id || 'anonymous'}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('event-flyers')
    .upload(filePath, form.flyerFile)
console.log('Upload error:', uploadError)
  if (uploadError) {
    setErrors({ name: 'Failed to upload flyer. Please try again.' })
    setStatus('idle')
    return
  }

  const { data: publicUrlData } = supabase.storage
    .from('event-flyers')
    .getPublicUrl(filePath)

  flyerUrl = publicUrlData.publicUrl
}
    console.log('Flyer URL:', flyerUrl)
const { data, error } = await supabase
      .from('events')
      .insert([{
        name:            form.name,
        date:            form.date,
        end_date:        form.endDate || null,
        city:            form.city,
        state:           form.state,
        flyer_image_url: flyerUrl,
        state_code:      form.stateCode,
        arena:           form.arena,
        arena_address:   form.arenaAddress || null,
        added_money:     Number(form.addedMoney),
        entry_fee:       Number(form.entryFee),
        classes:         form.classes,
        facebook_url:    form.facebookUrl || null,
        website_url:     form.websiteUrl || null,
        contact_name:    form.contactName || null,
        contact_email:   form.contactEmail || null,
        contact_phone:   form.contactPhone || null,
        notes:           form.notes || null,
        is_approved:     false,
        is_featured:     false,
        submitted_by:    user?.id ?? null,
      }])
      .select()
    
      .single()
      console.log('Event insert error:', error)
console.log('Event insert data:', data)

    if (error) {
      setErrors({ name: 'Failed to submit. Please try again.' })
      setStatus('idle')
      return
    }

    // Build a local preview from the returned row
    const saved: BarrelRace = {
      id:           data.id,
      name:         data.name,
      date:         data.date,
      endDate:      data.end_date ?? undefined,
      city:         data.city,
      state:        data.state,
      stateCode:    data.state_code,
      arena:        data.arena,
      addedMoney:   data.added_money,
      entryFee:     data.entry_fee,
      classes:      data.classes ?? [],
      isFeatured:   false,
      isApproved:   false,
    }

    setSubmittedEvent(saved)
    setStatus('success')
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  const fieldError = (key: keyof EventSubmission) =>
    errors[key] ? (
      <p className="mt-1.5 font-sans text-xs text-red-600 flex items-center gap-1">
        <Info className="w-3 h-3 flex-shrink-0" />
        {errors[key]}
      </p>
    ) : null

  const inputCls = (key: keyof EventSubmission) =>
    `input-field ${errors[key] ? 'border-red-400 focus:ring-red-400' : ''}`

  const previewEvent: BarrelRace = formToBarrelRace(form)
  const notesLength = form.notes?.length ?? 0
  // ── Success screen ─────────────────────────────────────────────────────────

  if (status === 'success' && submittedEvent) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-cream">
        <div className="page-container mt-8">
          <div className="max-w-lg mx-auto animate-fade-up">

            {/* Checkmark */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-prairie-100 rounded-full flex items-center
                              justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-prairie-600" />
              </div>
              <h1 className="font-display text-3xl font-700 text-charcoal mb-2">
                Race Submitted!
              </h1>
              <p className="font-body text-dust-600 leading-relaxed">
                <strong>{submittedEvent.name}</strong> has been saved and is
                visible in the browse list marked as pending review.
              </p>
            </div>

            {/* Card preview */}
            <div className="mb-8">
              <p className="font-sans text-xs text-dust-400 uppercase tracking-wider
                            font-600 mb-3">
                Your Listing
              </p>
              <EventCard event={submittedEvent} />
            </div>

            {/* What happens next timeline */}
            <div className="bg-white rounded-2xl border border-dust-100 p-6 mb-8">
              <h2 className="font-display text-lg font-700 text-charcoal mb-5">
                What Happens Next?
              </h2>
              <div className="space-y-0">
                {[
                  {
                    icon: <CheckCircle className="w-5 h-5 text-prairie-600" />,
                    bg: 'bg-prairie-100',
                    title: 'Submitted',
                    desc: 'Your race is saved and visible to you right now.',
                    done: true,
                  },
                  {
                    icon: <Clock className="w-5 h-5 text-amber-600" />,
                    bg: 'bg-amber-100',
                    title: 'Under Review',
                    desc: 'Our team reviews submissions within 24–48 hours.',
                    done: false,
                  },
                  {
                    icon: <Star className="w-5 h-5 text-saddle-600" />,
                    bg: 'bg-saddle-100',
                    title: 'Published',
                    desc: 'Approved races are listed publicly for all riders to find.',
                    done: false,
                  },
                  {
                    icon: <Globe className="w-5 h-5 text-blue-600" />,
                    bg: 'bg-blue-100',
                    title: 'Riders Find You',
                    desc: 'Your event is searchable by state, date, and division.',
                    done: false,
                  },
                ].map((step, i, arr) => (
                  <div key={step.title} className="flex gap-4">
                    {/* Icon + connector line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center
                                      justify-center flex-shrink-0 ${step.bg}`}>
                        {step.icon}
                      </div>
                      {i < arr.length - 1 && (
                        <div className="w-px flex-1 bg-dust-200 my-1" />
                      )}
                    </div>
                    {/* Text */}
                    <div className="pb-5 pt-1.5 min-w-0">
                      <p className={`font-sans text-sm font-700
                        ${step.done ? 'text-prairie-700' : 'text-charcoal'}`}>
                        {step.title}
                        {step.done && (
                          <span className="ml-2 font-400 text-prairie-600">✓ Done</span>
                        )}
                      </p>
                      <p className="font-sans text-xs text-dust-500 mt-0.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/events" className="btn-primary flex-1 justify-center">
                Browse All Races
              </Link>
              <button
                onClick={() => {
                  setForm(EMPTY_FORM)
                  setFlyerPreview(null)
                  setSubmittedEvent(null)
                  setStatus('idle')
                  setCurrentStep(1)
                }}
                className="btn-secondary flex-1 justify-center"
              >
                Submit Another Race
              </button>
            </div>

          </div>
        </div>
      </div>
    )
  }

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
            List your barrel race for free. Reach thousands of riders.
          </p>
        </div>
      </div>

      <div className="page-container mt-8">
        <div className="max-w-2xl mx-auto">

          {/* ── Progress bar ─────────────────────────────────────────────── */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((step, i) => {
                const done   = currentStep > step.number
                const active = currentStep === step.number
                return (
                  <div key={step.number} className="flex items-center flex-1">
                    {/* Step circle */}
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center
                                      font-sans text-sm font-700 transition-all duration-300
                        ${done
                          ? 'bg-prairie-500 text-white'
                          : active
                            ? 'bg-saddle-600 text-white ring-4 ring-saddle-200'
                            : 'bg-dust-200 text-dust-500'
                        }`}>
                        {done ? '✓' : step.number}
                      </div>
                      <span className={`font-sans text-xs font-500 whitespace-nowrap
                        ${active ? 'text-saddle-700' : done ? 'text-prairie-600' : 'text-dust-400'}`}>
                        {step.label}
                      </span>
                    </div>
                    {/* Connector line between steps */}
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all duration-300
                        ${done ? 'bg-prairie-400' : 'bg-dust-200'}`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Live preview toggle ──────────────────────────────────────── */}
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
                  <EventCard event={previewEvent} />
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* ══ STEP 1: Race Details ══════════════════════════════════════ */}
            {currentStep === 1 && (
              <div className="card p-6 md:p-8 space-y-5 animate-fade-up">
                <StepHeader
                  number={1}
                  title="Race Details"
                  desc="Tell us about the event location and date."
                />

                <div>
                  <label htmlFor="name" className="label">Race Name *</label>
                  <input
                    id="name" type="text" value={form.name}
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
                      id="date" type="date" value={form.date}
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
                      id="endDate" type="date" value={form.endDate}
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
                      id="city" type="text" value={form.city}
                      onChange={e => set('city', e.target.value)}
                      placeholder="e.g. Weatherford"
                      className={inputCls('city')}
                    />
                    {fieldError('city')}
                  </div>
                  <div>
                    <label htmlFor="stateCode" className="label">State *</label>
                    <select
                      id="stateCode" value={form.stateCode}
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
                    id="arena" type="text" value={form.arena}
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
                    id="arenaAddress" type="text" value={form.arenaAddress}
                    onChange={e => set('arenaAddress', e.target.value)}
                    placeholder="e.g. 516 W Main St, Weatherford, TX 76086"
                    className="input-field"
                  />
                </div>

                <NavButtons onNext={goNext} step={1} total={STEPS.length} />
              </div>
            )}

            {/* ══ STEP 2: Fees & Divisions ══════════════════════════════════ */}
            {currentStep === 2 && (
              <div className="card p-6 md:p-8 space-y-5 animate-fade-up">
                <StepHeader
                  number={2}
                  title="Fees & Divisions"
                  desc="Set entry costs and which divisions will compete."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="entryFee" className="label">
                      Entry Fee per Run ($) *
                    </label>
                    <input
                      id="entryFee" type="number" min={0} step={5}
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
                      id="addedMoney" type="number" min={0} step={500}
                      value={form.addedMoney || ''}
                      onChange={e => set('addedMoney', Number(e.target.value))}
                      placeholder="5000"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Flyer upload — large zone */}
                <div>
                  <label className="label">
                    Event Flyer{' '}
                    <span className="text-dust-400 font-400">(optional)</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-2xl transition-colors
                    ${flyerPreview
                      ? 'border-saddle-300 bg-saddle-50'
                      : 'border-dust-200 hover:border-saddle-400 bg-white'
                    }`}>
                    {flyerPreview ? (
                      <div className="flex items-center gap-4 p-4">
                        <img
                          src={flyerPreview}
                          alt="Flyer preview"
                          className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
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
                          onClick={() => { set('flyerFile', null); setFlyerPreview(null) }}
                          className="p-2 hover:bg-dust-100 rounded-full transition-colors
                                     text-dust-400 hover:text-dust-600 flex-shrink-0"
                          aria-label="Remove flyer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center gap-3 cursor-pointer
                                        py-10 px-6 text-center">
                        <div className="w-14 h-14 bg-dust-100 rounded-2xl flex items-center
                                        justify-center">
                          <Upload className="w-7 h-7 text-dust-400" />
                        </div>
                        <div>
                          <p className="font-sans text-base font-600 text-charcoal">
                            Drop your flyer here
                          </p>
                          <p className="font-sans text-sm text-dust-400 mt-1">
                            or click to browse · PNG, JPG, PDF up to 10 MB
                          </p>
                        </div>
                        {/* TODO: AI flyer reader — parse event details from image */}
                        <input
                          type="file" accept="image/*,.pdf"
                          onChange={handleFlyerChange}
                          className="sr-only"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Division chips */}
                <div>
                  <label className="label">
                    Divisions{' '}
                    <span className="text-dust-400 font-400">(select all that apply)</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {AVAILABLE_CLASSES.map(cls => {
                      const selected = form.classes.includes(cls)
                      return (
                        <button
                          type="button" key={cls}
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

                <NavButtons
                  onNext={goNext}
                  onBack={goBack}
                  step={2}
                  total={STEPS.length}
                />
              </div>
            )}

            {/* ══ STEP 3: Contact & Links ═══════════════════════════════════ */}
            {currentStep === 3 && (
              <div className="card p-6 md:p-8 space-y-5 animate-fade-up">
                <StepHeader
                  number={3}
                  title="Contact & Links"
                  desc="How should riders get in touch or learn more?"
                />

                <div>
                  <label htmlFor="contactName" className="label">Your Name *</label>
                  <input
                    id="contactName" type="text" value={form.contactName}
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
                      id="contactEmail" type="email" value={form.contactEmail}
                      onChange={e => set('contactEmail', e.target.value)}
                      placeholder="you@example.com"
                      className={inputCls('contactEmail')}
                    />
                    {fieldError('contactEmail')}
                  </div>
                  <div>
                    <label htmlFor="contactPhone" className="label">Phone</label>
                    <input
                      id="contactPhone" type="tel" value={form.contactPhone}
                      onChange={e => set('contactPhone', e.target.value)}
                      placeholder="(555) 555-0000"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="facebookUrl" className="label">
                    Facebook Event URL
                  </label>
                  <input
                    id="facebookUrl" type="url" value={form.facebookUrl}
                    onChange={e => set('facebookUrl', e.target.value)}
                    placeholder="https://facebook.com/events/…"
                    className="input-field"
                  />
                </div>
<div>
  <label htmlFor="flyerFile" className="label">
    Event Flyer
  </label>

<input
  id="flyerFile"
  type="file"
  accept="image/*"
  className="input-field"
  onChange={(e) => {
    const file = e.target.files?.[0] || null
    set('flyerFile', file)
  }}
/>
</div>
                <div>
                  <label htmlFor="websiteUrl" className="label">
                    Official Website
                  </label>
                  <input
                    id="websiteUrl" type="url" value={form.websiteUrl}
                    onChange={e => set('websiteUrl', e.target.value)}
                    placeholder="https://…"
                    className="input-field"
                  />
                </div>

                {/* Notes with character counter */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="notes" className="label mb-0">
                      Additional Notes
                    </label>
                    <span className={`font-sans text-xs transition-colors
                      ${notesLength > NOTES_MAX * 0.9
                        ? notesLength >= NOTES_MAX
                          ? 'text-red-500 font-600'
                          : 'text-amber-600'
                        : 'text-dust-400'
                      }`}>
                      {notesLength}/{NOTES_MAX}
                    </span>
                  </div>
                  <textarea
                    id="notes" rows={4} value={form.notes}
                    maxLength={NOTES_MAX}
                    onChange={e => set('notes', e.target.value)}
                    placeholder="Stall reservations, payout structure, camping, entry form link…"
                    className="input-field resize-none"
                  />
                </div>

                {/* Submit info notice */}
                <div className="flex items-start gap-3 bg-saddle-50 border
                                border-saddle-100 rounded-xl p-4">
                  <Info className="w-4 h-4 text-saddle-600 flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-saddle-800 leading-relaxed">
                    Submissions are saved instantly and visible to you right away.
                    Public listing goes live after review within 24–48 hours.
                    Listing is always free.
                  </p>
                </div>

                <NavButtons
                  onBack={goBack}
                  step={3}
                  total={STEPS.length}
                  isSubmit
                  isSubmitting={status === 'submitting'}
                />
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepHeader({
  number, title, desc,
}: {
  number: number
  title: string
  desc: string
}) {
  return (
    <div className="pb-4 border-b border-dust-100">
      <div className="flex items-center gap-2.5 mb-1">
        <span className="w-6 h-6 rounded-full bg-saddle-600 text-white font-sans
                         text-xs font-700 flex items-center justify-center flex-shrink-0">
          {number}
        </span>
        <h2 className="font-display text-xl font-700 text-charcoal">{title}</h2>
      </div>
      <p className="font-sans text-sm text-dust-500 ml-8">{desc}</p>
    </div>
  )
}

function NavButtons({
  onNext,
  onBack,
  step,
  total,
  isSubmit = false,
  isSubmitting = false,
}: {
  onNext?: () => void
  onBack?: () => void
  step: number
  total: number
  isSubmit?: boolean
  isSubmitting?: boolean
}) {
  return (
    <div className="flex items-center justify-between pt-2 gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      ) : (
        <span />
      )}

      {isSubmit ? (
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white
                               rounded-full animate-spin" />
              Saving…
            </>
          ) : (
            <>
              Submit Race
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="btn-primary gap-1.5"
        >
          Next: {step < total ? STEPS[step].label : ''}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}