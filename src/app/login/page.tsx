'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [debugResult, setDebugResult] = useState('')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.replace('/dashboard')
      }
    }

    checkSession()
  }, [router])

  const testSettingsFetch = async () => {
    setDebugResult('Testing /auth/v1/settings ...')
    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
        headers: {
          apikey: supabaseKey,
        },
      })

      const text = await res.text()
      setDebugResult(`settings status=${res.status}\n${text}`)
      console.log('settings response', res.status, text)
    } catch (err) {
      console.error('settings fetch failed', err)
      setDebugResult(
        `settings fetch failed: ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'https://meet.rifzki.my.id/dashboard',
        },
      })

      console.log('OTP response:', { data, error })

      if (error) {
        setMessage(`Login gagal: ${error.message}`)
      } else {
        setMessage('Magic link sudah dikirim. Cek email kamu.')
      }
    } catch (err) {
      console.error('Unexpected login error:', err)
      setMessage(
        `Login gagal: ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    }

    setLoading(false)
  }

  return (
    <main style={{ padding: 40, maxWidth: 560 }}>
      <h1>Login</h1>
      <p>Masuk ke My Meeting App pakai email.</p>

      <form onSubmit={handleLogin} style={{ marginTop: 20 }}>
        <input
          type="email"
          placeholder="email@contoh.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: 12,
            marginBottom: 12,
            border: '1px solid #ccc',
            borderRadius: 8,
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            marginRight: 12,
          }}
        >
          {loading ? 'Mengirim...' : 'Kirim Magic Link'}
        </button>

        <button
          type="button"
          onClick={testSettingsFetch}
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            cursor: 'pointer',
            background: 'white',
          }}
        >
          Test Supabase Fetch
        </button>
      </form>

      {message && <p style={{ marginTop: 16 }}>{message}</p>}

      <pre style={{ marginTop: 24, fontSize: 12, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(
          {
            origin: typeof window !== 'undefined' ? window.location.origin : null,
            hasUrl: !!supabaseUrl,
            hasAnonKey: !!supabaseKey,
            supabaseUrl,
            keyPrefix: supabaseKey?.slice(0, 20) ?? null,
            keyLength: supabaseKey?.length ?? 0,
          },
          null,
          2
        )}
      </pre>

      {debugResult && (
        <pre style={{ marginTop: 16, fontSize: 12, whiteSpace: 'pre-wrap' }}>
          {debugResult}
        </pre>
      )}
    </main>
  )
}