import { useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function Login() {
  const { login, register } = useAuthStore()
  const [mode, setMode]         = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [passcode, setPasscode] = useState('')
  const [localError, setLocalError] = useState('')
  const [loading, setLoading]   = useState(false)

  const validate = () => {
    if (!username.trim())    { setLocalError('Please enter a username.'); return false }
    if (!passcode.trim())    { setLocalError('Please enter a passcode.'); return false }
    if (passcode.length < 4) { setLocalError('Passcode must be at least 4 characters.'); return false }
    setLocalError(''); return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    if (mode === 'login') {
      const ok = login(username.trim(), passcode)
      if (!ok) setLocalError('Incorrect username or passcode.')
    } else {
      const result = register(username.trim(), passcode)
      if (result === 'exists')    setLocalError('Username already taken. Try a different one.')
      if (result === 'too_short') setLocalError('Passcode must be at least 4 characters.')
    }
    setLoading(false)
  }

  const displayError = localError


  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{
        background: 'linear-gradient(155deg, #7ec8e3 0%, #9ed4ef 40%, #c2e3f4 75%, #daeef8 100%)',
      }}
    >


      {/* Card — white floating panel */}
      <div className="relative w-full max-w-sm animate-fade-in">
        {/* Bloom wordmark */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-[44px] text-ink tracking-[-1.5px] font-normal leading-none">Bloom</h1>
          <p className="text-[14px] text-graphite mt-2">Your personal life journal</p>
        </div>

        <div className="bg-white rounded-[24px] p-8"
          style={{ boxShadow: '0 8px 40px rgba(0,40,80,0.12), 0 2px 8px rgba(0,40,80,0.08)' }}>

          {/* Tab switcher */}
          <div className="flex bg-linen rounded-[12px] p-1 mb-7">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setLocalError('') }}
                className={`flex-1 py-2 rounded-[10px] text-[13.5px] font-medium transition-all ${
                  mode === m
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-stone hover:text-graphite'
                }`}
              >
                {m === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. namrata"
              autoComplete="username"
              autoFocus
            />
            <Input
              label="Passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder={mode === 'register' ? 'Choose a passcode (min 4 chars)' : 'Enter your passcode'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />

            {displayError && (
              <p className="text-[13px] text-red-500 bg-red-50 rounded-[10px] px-3 py-2">{displayError}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full h-11 mt-2 rounded-[12px]"
              loading={loading}
            >
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <p className="text-[12px] text-stone text-center mt-5 leading-relaxed">
            {mode === 'login'
              ? "Don't have an account? "
              : 'Already have an account? '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setLocalError('') }}
              className="text-graphite font-medium hover:text-ink underline"
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-[12px] text-graphite/60 mt-5">
          Your data stays on this device, always private.
        </p>
      </div>
    </div>
  )
}
