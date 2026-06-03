import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MapPin, Eye, EyeOff, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

type Mode = 'signin' | 'signup'

export default function AuthPage() {
  const [mode, setMode]               = useState<Mode>('signin')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [success, setSuccess]         = useState<string | null>(null)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const reset = () => {
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }
    if (mode === 'signup' && !displayName.trim()) {
      setError('Please enter your name.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    if (mode === 'signup') {
      const err = await signUp(email.trim(), password, displayName.trim())
      if (err) {
        setError(err)
      } else {
        setSuccess(
          'Account created! Check your email to confirm your address, then sign in.'
        )
        setMode('signin')
        setPassword('')
      }
    } else {
      const err = await signIn(email.trim(), password)
      if (err) {
        setError(
          err.includes('Invalid login')
            ? 'Incorrect email or password.'
            : err
        )
      } else {
        navigate('/')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-saddle-600 rounded-2xl flex items-center
                          justify-center mx-auto mb-4 shadow-md">
            <MapPin className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-3xl font-bold text-charcoal">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="font-sans text-dust-500 text-sm mt-2">
            {mode === 'signin'
              ? 'Sign in to save races and manage your events.'
              : 'Join the barrel racing community for free.'
            }
          </p>
        </div>

        {/* Card */}
        <div className="card p-7 shadow-md">

          {/* Mode toggle */}
          <div className="flex bg-dust-100 rounded-xl p-1 mb-7">
            {(['signin', 'signup'] as Mode[]).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); reset() }}
                className={`flex-1 py-2 rounded-lg font-sans text-sm font-semibold
                            transition-all duration-200
                  ${mode === m
                    ? 'bg-white text-charcoal shadow-sm'
                    : 'text-dust-500 hover:text-charcoal'
                  }`}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Success message */}
          {success && (
            <div className="flex items-start gap-3 bg-prairie-50 border border-prairie-200
                            rounded-xl p-4 mb-5">
              <Info className="w-4 h-4 text-prairie-600 flex-shrink-0 mt-0.5" />
              <p className="font-sans text-sm text-prairie-800">{success}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200
                            rounded-xl p-4 mb-5">
              <Info className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="font-sans text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Display name — signup only */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="displayName" className="label">Your Name</label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="First and last name"
                  className="input-field"
                  autoComplete="name"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                autoComplete={mode === 'signin' ? 'email' : 'new-email'}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  className="input-field pr-11"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-dust-400
                             hover:text-dust-600 transition-colors rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 mt-2
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white
                                   rounded-full animate-spin" />
                  {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>

          </form>

          {/* Footer note */}
          <p className="font-sans text-xs text-dust-400 text-center mt-5 leading-relaxed">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); reset() }}
                  className="text-saddle-600 hover:text-saddle-800 underline
                             underline-offset-2 transition-colors"
                >
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('signin'); reset() }}
                  className="text-saddle-600 hover:text-saddle-800 underline
                             underline-offset-2 transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center font-sans text-xs text-dust-400 mt-6">
          <Link to="/events" className="hover:text-saddle-600 transition-colors">
            Browse races without an account →
          </Link>
        </p>
      </div>
    </div>
  )
}