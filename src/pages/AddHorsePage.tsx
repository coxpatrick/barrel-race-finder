import { ArrowLeft, Save } from 'lucide-react'

export default function AddHorsePage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="page-container py-12 lg:py-16">

        <div className="mb-8">
          <a
  href="/stable"
  className="flex items-center gap-2 text-saddle-600 hover:text-saddle-800 font-sans text-sm font-600 mb-5"
>
  <ArrowLeft className="w-4 h-4" />
  Back to My Stable
</a>

          <p className="font-sans text-sm font-600 uppercase tracking-wider text-saddle-600 mb-2">
            My Stable
          </p>

          <h1 className="font-display text-4xl md:text-5xl font-800 text-charcoal mb-3">
            Add Horse
          </h1>

          <p className="font-body text-dust-500 text-lg max-w-2xl">
            Create a profile for a horse in your stable.
          </p>
        </div>
<div className="bg-white rounded-2xl border border-dust-100 shadow-sm p-6 md:p-8">
  <h2 className="font-display text-2xl font-700 text-charcoal mb-6">
    Basic Information
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block font-sans text-sm font-600 text-charcoal mb-2">
        Horse Name *
      </label>

      <input
        type="text"
        placeholder="Example: Dancer"
        className="w-full rounded-xl border border-dust-200 bg-white px-4 py-3 font-body text-charcoal outline-none focus:border-saddle-500"
      />
    </div>

    <div>
      <label className="block font-sans text-sm font-600 text-charcoal mb-2">
        Rider Name
      </label>

      <input
        type="text"
        placeholder="Example: Patrick Cox"
        className="w-full rounded-xl border border-dust-200 bg-white px-4 py-3 font-body text-charcoal outline-none focus:border-saddle-500"
      />
    </div>
  <div>
  <label className="block font-sans text-sm font-600 text-charcoal mb-2">
    Breed
  </label>

  <input
    type="text"
    placeholder="Example: Quarter Horse"
    className="w-full rounded-xl border border-dust-200 bg-white px-4 py-3 font-body text-charcoal outline-none focus:border-saddle-500"
  />
</div>

<div>
  <label className="block font-sans text-sm font-600 text-charcoal mb-2">
    Color
  </label>

  <input
    type="text"
    placeholder="Example: Sorrel"
    className="w-full rounded-xl border border-dust-200 bg-white px-4 py-3 font-body text-charcoal outline-none focus:border-saddle-500"
  />
</div>
<div>
  <label className="block font-sans text-sm font-600 text-charcoal mb-2">
    Sex
  </label>

  <select
    className="w-full rounded-xl border border-dust-200 bg-white px-4 py-3 font-body text-charcoal outline-none focus:border-saddle-500"
    defaultValue=""
  >
    <option value="" disabled>
      Select sex
    </option>
    <option value="mare">Mare</option>
    <option value="gelding">Gelding</option>
    <option value="stallion">Stallion</option>
  </select>
</div>

<div>
  <label className="block font-sans text-sm font-600 text-charcoal mb-2">
    Birth Year
  </label>

  <input
    type="number"
    placeholder="Example: 2018"
    className="w-full rounded-xl border border-dust-200 bg-white px-4 py-3 font-body text-charcoal outline-none focus:border-saddle-500"
  />
</div>
<div>
  <label className="block font-sans text-sm font-600 text-charcoal mb-2">
    Height (Hands)
  </label>

  <input
    type="number"
    step="0.01"
    placeholder="Example: 15.2"
    className="w-full rounded-xl border border-dust-200 bg-white px-4 py-3 font-body text-charcoal outline-none focus:border-saddle-500"
  />
</div>

</div>
</div>

<div className="bg-white rounded-2xl border border-dust-100 shadow-sm p-6 md:p-8 mt-6">
  <h2 className="font-display text-2xl font-700 text-charcoal mb-2">
    Profile & Visibility
  </h2>

  <p className="font-body text-dust-500 mb-6">
    Add a photo and choose whether other Barrel Bay users can view this horse.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block font-sans text-sm font-600 text-charcoal mb-2">
        Horse Photo
      </label>

      <div className="rounded-xl border-2 border-dashed border-dust-200 p-8 text-center bg-dust-50">
        <p className="font-body text-dust-500">
          Horse photo upload will go here.
        </p>

        <p className="font-sans text-xs text-dust-400 mt-2">
          JPG or PNG
        </p>
      </div>
    </div>

    <div>
      <label className="block font-sans text-sm font-600 text-charcoal mb-3">
        Profile Visibility
      </label>

      <label className="flex items-start gap-3 rounded-xl border border-dust-200 p-4 cursor-pointer">
        <input
          type="checkbox"
          defaultChecked
          className="mt-1"
        />

        <div>
          <p className="font-sans font-600 text-charcoal">
            Public Horse Profile
          </p>

          <p className="font-body text-sm text-dust-500 mt-1">
            Allow other Barrel Bay users to view this horse and its public runs.
          </p>
        </div>
      </label>
    </div>
  </div>
</div>
<div className="flex justify-end mt-6">
  <button
    type="button"
    className="btn-primary flex items-center gap-2"
  >
    <Save className="w-4 h-4" />
    Save Horse
  </button>
</div>
      </section>
    </div>
  )
}