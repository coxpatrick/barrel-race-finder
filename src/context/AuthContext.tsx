import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { DbProfile } from '../types/database'
import { fetchProfile } from '../lib/api'

interface AuthContextType {
  user:       User | null
  session:    Session | null
  profile:    DbProfile | null
  isAdmin:    boolean
  loading:    boolean
  signUp:     (email: string, password: string, displayName: string) => Promise<string | null>
  signIn:     (email: string, password: string) => Promise<string | null>
  signOut:    () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<DbProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (userId: string) => {
    const p = await fetchProfile(userId)
    setProfile(p)
  }

useEffect(() => {
  let mounted = true

  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!mounted) return

    setSession(session)
    setUser(session?.user ?? null)
    setLoading(false)

    if (session?.user) {
      setTimeout(() => {
        if (mounted) {
          loadProfile(session.user.id)
        }
      }, 0)
    }
  })

  // Listen for auth changes
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!mounted) return

    setSession(session)
    setUser(session?.user ?? null)
    setLoading(false)

    if (session?.user) {
      setTimeout(() => {
        if (mounted) {
          loadProfile(session.user.id)
        }
      }, 0)
    } else {
      setProfile(null)
    }
  })

  return () => {
    mounted = false
    subscription.unsubscribe()
  }
}, [])

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    return error?.message ?? null
  }

  const signIn = async (
    email: string,
    password: string
  ): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message ?? null
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isAdmin: profile?.is_admin ?? false,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}