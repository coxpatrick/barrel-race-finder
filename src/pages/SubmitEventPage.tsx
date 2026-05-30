import { useState } from 'react';
import { CheckCircle, Upload, Info, ChevronRight } from 'lucide-react';
import { US_STATES } from '../data/constants';
import { EventSubmission } from '../types';

const AVAILABLE_CLASSES = [
  'Open', '1D–4D', '1D–5D', '2D–4D', '2D–5D',
  'Futurity', 'Derby', 'Youth 12 & Under', 'Youth 13–17',
  'Junior', 'Novice Rider', 'Novice Horse', 'Senior 50+', 'Senior 55+',
  'Beginner', 'Lead Line', 'Poles', 'Flags', 'Amateur',
];

const EMPTY_FORM: EventSubmission = {
  name: '', date: '', endDate: '', city: '', state: '', stateCode: '',
  arena: '', arenaAddress: '', addedMoney: 0, entryFee: 0,
  classes: [], flyerFile: null,
  facebookUrl: '', websiteUrl: '',
  contactName: '', contactEmail: '', contactPhone: '', notes: '',
};

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function SubmitEventPage() {
  const [form, setForm]       = useState<EventSubmission>(EMPTY_FORM);
  const [status, setStatus]   = useState<SubmitStatus>('idle');
  const [errors, setErrors]   = useState<Partial<Record<keyof EventSubmission, string>>>({});
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);

  const set = <K extends keyof EventSubmission>(key: K, value: EventSubmission[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleClass = (cls: string) => {
    set('classes', form.classes.includes(cls)
      ? form.classes.filter((c) => c !== cls)
      : [...form.classes, cls]
    );
  };

  const handleFlyerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    set('flyerFile', file);
    if (file) {
      const url = URL.createObjectURL(file);
      setFlyerPreview(url);
    } else {
      setFlyerPreview(null);
    }
  };

  const handleStateChange = (stateCode: string) => {
    const found = US_STATES.find((s) => s.value === stateCode);
    set('stateCode', stateCode);
    set('state', found?.label ?? '');
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.name.trim())      newErrors.name      = 'Race name is required';
    if (!form.date)             newErrors.date      = 'Date is required';
    if (!form.city.trim())      newErrors.city      = 'City is required';
    if (!form.stateCode)        newErrors.stateCode = 'State is required';
    if (!form.arena.trim())     newErrors.arena     = 'Arena name is required';
    if (form.entryFee <= 0)     newErrors.entryFee  = 'Entry fee must be greater than $0';
    if (!form.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!form.contactEmail.trim() && !form.contactPhone.trim()) {
      newErrors.contactEmail = 'At least one contact method required (email or phone)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');

    // TODO: Replace with real API call to Firebase or Supabase
    // Example Firebase:
    //   import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
    //   import { db } from '../lib/firebase';
    //   await addDoc(collection(db, 'events'), { ...form, flyerFile: null, isApproved: false, createdAt: serverTimestamp() });
    //
    // Example Supabase:
    //   import { supabase } from '../lib/supabase';
    //   await supabase.from('events').insert([{ ...form, flyerFile: null, is_approved: false }]);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center max-w-md px-6 animate-fade-up">
          <div className="w-20 h-20 bg-prairie-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-prairie-600" />
          </div>
          <h1 className="font-display text-3xl font-700 text-charcoal mb-3">
            Race Submitted!
          </h1>
          <p className="font-body text-dust-600 mb-8 leading-relaxed">
            Thanks for submitting <strong>{form.name}</strong>. Our team will review it
            and it will appear on the site within 24–48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setForm(EMPTY_FORM); setStatus('idle'); setFlyerPreview(null); }}
              className="btn-secondary">
              Submit Another Race
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fieldError = (key: keyof EventSubmission) =>
    errors[key] ? (
      <p className="mt-1 font-sans text-xs text-red-600 flex items-center gap-1">
        <Info className="w-3 h-3" /> {errors[key]}
      </p>
    ) : null;

  const inputClass = (key: keyof EventSubmission) =>
    `input-field ${errors[key] ? 'border-red-400 focus:ring-red-400' : ''}`;

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="bg-charcoal text-white py-10 lg:py-14">
        <div className="page-container">
          <h1 className="font-display text-3xl md:text-4xl font-700 mb-2">Submit an Event</h1>
          <p className="font-body text-white/60">
            List your barrel race for free. Reach thousands of riders searching for their next event.
          </p>
        </div>
      </div>

      <div className="page-container mt-8">
        <div className="max-w-3xl mx-auto">
          {/* Notice */}
          <div className="flex items-start gap-3 bg-saddle-50 border border-saddle-200 rounded-xl p-4 mb-8">
            <Info className="w-5 h-5 text-saddle-600 flex-shrink-0 mt-0.5" />
            <p className="font-sans text-sm text-saddle-800">
              All submissions are reviewed before going live. You'll typically see your race posted within
              24–48 hours. Listing is always free.
              {/* TODO: Add email notification when approval workflow is implemented */}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── Section: Race Info ──────────────────────────────────── */}
            <section className="card p-6 lg:p-8 space-y-5">
              <h2 className="font-display text-xl font-700 text-charcoal pb-3 border-b border-dust-100">
                Race Information
              </h2>

              {/* Race name */}
              <div>
                <label className="label">Race Name *</label>
                <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Lone Star Summer Barrel Bash" className={inputClass('name')} />
                {fieldError('name')}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date *</label>
                  <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
                    className={inputClass('date')} />
                  {fieldError('date')}
                </div>
                <div>
                  <label className="label">End Date <span className="text-dust-400 font-400">(multi-day)</span></label>
                  <input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)}
                    min={form.date} className="input-field" />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">City *</label>
                  <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)}
                    placeholder="e.g. Weatherford" className={inputClass('city')} />
                  {fieldError('city')}
                </div>
                <div>
                  <label className="label">State *</label>
                  <select value={form.stateCode} onChange={(e) => handleStateChange(e.target.value)}
                    className={inputClass('stateCode')}>
                    <option value="">Select state…</option>
                    {US_STATES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  {fieldError('stateCode')}
                </div>
              </div>

              {/* Arena */}
              <div>
                <label className="label">Arena / Venue Name *</label>
                <input type="text" value={form.arena} onChange={(e) => set('arena', e.target.value)}
                  placeholder="e.g. Parker County Expo Center" className={inputClass('arena')} />
                {fieldError('arena')}
              </div>

              <div>
                <label className="label">Arena Address <span className="text-dust-400 font-400">(helps with mapping)</span></label>
                <input type="text" value={form.arenaAddress} onChange={(e) => set('arenaAddress', e.target.value)}
                  placeholder="e.g. 516 W Main St, Weatherford, TX 76086" className="input-field" />
              </div>
            </section>

            {/* ── Section: Entry & Fees ───────────────────────────────── */}
            <section className="card p-6 lg:p-8 space-y-5">
              <h2 className="font-display text-xl font-700 text-charcoal pb-3 border-b border-dust-100">
                Entry & Fees
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Entry Fee per Run ($) *</label>
                  <input type="number" min={0} value={form.entryFee || ''} step="5"
                    onChange={(e) => set('entryFee', Number(e.target.value))}
                    placeholder="60" className={inputClass('entryFee')} />
                  {fieldError('entryFee')}
                </div>
                <div>
                  <label className="label">Added Money ($) <span className="text-dust-400 font-400">(0 for jackpot)</span></label>
                  <input type="number" min={0} value={form.addedMoney || ''} step="500"
                    onChange={(e) => set('addedMoney', Number(e.target.value))}
                    placeholder="5000" className="input-field" />
                </div>
              </div>

              {/* Classes */}
              <div>
                <label className="label">Divisions / Classes</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {AVAILABLE_CLASSES.map((cls) => {
                    const selected = form.classes.includes(cls);
                    return (
                      <button
                        type="button"
                        key={cls}
                        onClick={() => toggleClass(cls)}
                        className={`px-3 py-1.5 rounded-full font-sans text-sm font-500 transition-all duration-150
                          ${selected
                            ? 'bg-saddle-600 text-white shadow-sm'
                            : 'bg-white border border-dust-200 text-dust-600 hover:border-saddle-400'
                          }`}>
                        {cls}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ── Section: Flyer & Links ──────────────────────────────── */}
            <section className="card p-6 lg:p-8 space-y-5">
              <h2 className="font-display text-xl font-700 text-charcoal pb-3 border-b border-dust-100">
                Flyer & Links
              </h2>

              {/* Flyer upload */}
              <div>
                <label className="label">Event Flyer</label>
                <div className={`border-2 border-dashed rounded-xl p-6 transition-colors
                  ${flyerPreview ? 'border-saddle-300 bg-saddle-50' : 'border-dust-200 hover:border-saddle-300'}`}>
                  {flyerPreview ? (
                    <div className="flex items-center gap-4">
                      <img src={flyerPreview} alt="Flyer preview" className="w-20 h-20 object-cover rounded-lg" />
                      <div>
                        <p className="font-sans text-sm font-600 text-charcoal">{form.flyerFile?.name}</p>
                        <button type="button" onClick={() => { set('flyerFile', null); setFlyerPreview(null); }}
                          className="font-sans text-xs text-saddle-600 hover:text-saddle-800 mt-1 underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-3 cursor-pointer">
                      <div className="w-12 h-12 bg-dust-100 rounded-xl flex items-center justify-center">
                        <Upload className="w-6 h-6 text-dust-400" />
                      </div>
                      <div className="text-center">
                        <p className="font-sans text-sm font-600 text-charcoal">
                          Click to upload flyer
                        </p>
                        <p className="font-sans text-xs text-dust-400 mt-1">PNG, JPG, PDF up to 10MB</p>
                      </div>
                      {/* TODO: Add AI flyer reader to auto-extract event details */}
                      {/* <span className="badge bg-saddle-100 text-saddle-700">🤖 AI Auto-Fill coming soon</span> */}
                      <input type="file" accept="image/*,.pdf" onChange={handleFlyerChange} className="sr-only" />
                    </label>
                  )}
                </div>
              </div>

              {/* Links */}
              <div>
                <label className="label">Facebook Event URL</label>
                <input type="url" value={form.facebookUrl}
                  onChange={(e) => set('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/events/..." className="input-field" />
              </div>

              <div>
                <label className="label">Official Website</label>
                <input type="url" value={form.websiteUrl}
                  onChange={(e) => set('websiteUrl', e.target.value)}
                  placeholder="https://..." className="input-field" />
              </div>
            </section>

            {/* ── Section: Contact ────────────────────────────────────── */}
            <section className="card p-6 lg:p-8 space-y-5">
              <h2 className="font-display text-xl font-700 text-charcoal pb-3 border-b border-dust-100">
                Contact Information
              </h2>

              <div>
                <label className="label">Contact Name *</label>
                <input type="text" value={form.contactName}
                  onChange={(e) => set('contactName', e.target.value)}
                  placeholder="Your name" className={inputClass('contactName')} />
                {fieldError('contactName')}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Email</label>
                  <input type="email" value={form.contactEmail}
                    onChange={(e) => set('contactEmail', e.target.value)}
                    placeholder="you@example.com" className={inputClass('contactEmail')} />
                  {fieldError('contactEmail')}
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input type="tel" value={form.contactPhone}
                    onChange={(e) => set('contactPhone', e.target.value)}
                    placeholder="(555) 555-0000" className="input-field" />
                </div>
              </div>

              <div>
                <label className="label">Additional Notes</label>
                <textarea value={form.notes} rows={4}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Camping available, stall reservations, entry form link, payout structure…"
                  className="input-field resize-none" />
              </div>
            </section>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary flex-1 justify-center py-4 text-base disabled:opacity-70 disabled:cursor-not-allowed">
                {status === 'submitting' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full lasso-spin" />
                    Submitting…
                  </>
                ) : (
                  <>Submit Race for Review <ChevronRight className="w-5 h-5" /></>
                )}
              </button>
            </div>

            <p className="font-sans text-xs text-dust-400 text-center">
              By submitting, you confirm this is a real upcoming event and you have permission to list it.
              We'll review and approve within 24–48 hours.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
