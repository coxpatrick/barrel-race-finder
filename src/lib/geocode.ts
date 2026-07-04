export async function geocodeAddress(address: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}&limit=1`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to geocode address')
  }

  const data = await response.json()

  if (!data || data.length === 0) {
    return null
  }

  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
  }
}