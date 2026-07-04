import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import type { BarrelRace } from './types'

interface EventMapProps {
  events: BarrelRace[]
}

export default function EventMap({ events }: EventMapProps) {
  return (
    <MapContainer
      center={[34.9618, -89.8295]}
      zoom={6}
      style={{
        height: '600px',
        width: '100%',
        borderRadius: '16px',
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {events.map((event) => (
        <Marker
          key={event.id}
          position={[event.lat ?? 34.9618, event.lng ?? -89.8295]}
        >
 <Popup>
  <div className="min-w-[230px] space-y-2">
    <h3 className="text-xl font-bold text-charcoal">
      {event.name}
    </h3>

    <p className="text-sm">
      📍 {event.city}, {event.state}
    </p>

    <p className="text-sm">
      🗓 {new Date(event.date).toLocaleDateString()}
    </p>

    <p className="text-sm">
      💰 ${event.addedMoney.toLocaleString()} Added
    </p>

    <Link
      to={`/events/${event.id}`}
      className="inline-block rounded-lg bg-saddle-600 px-4 py-2 text-sm font-semibold text-white hover:bg-saddle-700"
    >
      View Details →
    </Link>
  </div>
</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}