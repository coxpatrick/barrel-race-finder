import { Link } from 'react-router-dom';
import { MapPin, Heart, Zap, Users, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="bg-charcoal text-white py-14 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #cc7f28 0px, #cc7f28 1px, transparent 1px, transparent 30px)`,
          }}
        />
        <div className="page-container relative text-center">
          <h1 className="font-display text-4xl md:text-5xl font-900 mb-4">
            About Barrel Race Finder
          </h1>
          <p className="font-body text-white/60 text-lg max-w-xl mx-auto">
            Built by barrel racers, for barrel racers.
          </p>
        </div>
      </div>

      <div className="page-container py-16 max-w-4xl mx-auto space-y-16">

        {/* Mission */}
        <section className="text-center">
          <div className="w-16 h-16 bg-saddle-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-saddle-600" />
          </div>
          <h2 className="section-title mb-4">Our Mission</h2>
          <p className="font-body text-dust-600 text-lg leading-relaxed max-w-2xl mx-auto">
            Barrel racing has an incredible community — but finding events is still a mess of
            Facebook groups, paper flyers, and word-of-mouth. We're changing that.
          </p>
          <p className="font-body text-dust-600 text-lg leading-relaxed max-w-2xl mx-auto mt-4">
            Barrel Race Finder is a free, easy-to-use platform where riders can search for
            upcoming events by state, date, and division — and where promoters can list their
            races in minutes.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="section-title text-center mb-10">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6 text-saddle-600" />,
                title: 'Fast & Free',
                desc: 'Searching for events will always be 100% free. No sign-up required to browse races.',
              },
              {
                icon: <Users className="w-6 h-6 text-saddle-600" />,
                title: 'Community-Driven',
                desc: 'Events are submitted by producers and community members who love the sport.',
              },
              {
                icon: <MapPin className="w-6 h-6 text-saddle-600" />,
                title: 'Nationwide Coverage',
                desc: 'We cover barrel races from Texas to Montana, and everywhere in between.',
              },
            ].map((v) => (
              <div key={v.title} className="card p-6 text-center">
                <div className="w-12 h-12 bg-saddle-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {v.icon}
                </div>
                <h3 className="font-display text-lg font-700 text-charcoal mb-2">{v.title}</h3>
                <p className="font-body text-dust-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section className="bg-saddle-50 rounded-3xl p-8 lg:p-10 border border-saddle-100">
          <h2 className="section-title mb-2">What's Coming</h2>
          <p className="font-body text-dust-500 mb-8">
            We're just getting started. Here's what's on the roadmap.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { soon: true,  label: 'User accounts & saved races' },
              { soon: true,  label: 'Email notifications for new races' },
              { soon: false, label: 'AI flyer reader — auto-fill from photo' },
              { soon: false, label: 'Race results & leaderboards' },
              { soon: false, label: 'Google Maps integration' },
              { soon: false, label: 'Mobile app (iOS & Android)' },
              { soon: false, label: 'Push notifications' },
              { soon: false, label: 'Rider & producer profiles' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0
                  ${item.soon ? 'bg-saddle-500' : 'bg-dust-300'}`} />
                <span className={`font-sans text-sm ${item.soon ? 'text-charcoal font-500' : 'text-dust-500'}`}>
                  {item.label}
                  {item.soon && (
                    <span className="ml-2 badge bg-saddle-100 text-saddle-700 text-xs">Soon</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="section-title mb-4">Ready to Ride?</h2>
          <p className="font-body text-dust-500 mb-8">
            Find your next race or list your event for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events" className="btn-primary text-base px-8 py-4">
              Browse Races <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/submit" className="btn-secondary text-base px-8 py-4">
              Submit an Event
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
