import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchUserFavorites, addFavorite, removeFavorite } from '../lib/api'

export function useFavorites() {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [loading, setLoading]         = useState(false)

  // Load favorites when user logs in
  useEffect(() => {
    if (!user) {
      setFavoriteIds([])
      return
    }
    setLoading(true)
    fetchUserFavorites(user.id).then(ids => {
      setFavoriteIds(ids)
      setLoading(false)
    })
  }, [user])

  const isFavorited = (eventId: string) => favoriteIds.includes(eventId)

  const toggleFavorite = async (eventId: string) => {
    if (!user) return false

    const alreadySaved = isFavorited(eventId)

    // Optimistic update — update UI immediately before waiting for DB
    setFavoriteIds(prev =>
      alreadySaved
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    )

    const ok = alreadySaved
      ? await removeFavorite(user.id, eventId)
      : await addFavorite(user.id, eventId)

    // Roll back if the DB call failed
    if (!ok) {
      setFavoriteIds(prev =>
        alreadySaved
          ? [...prev, eventId]
          : prev.filter(id => id !== eventId)
      )
    }

    return ok
  }

  return { favoriteIds, isFavorited, toggleFavorite, loading }
}