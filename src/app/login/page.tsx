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

  const testOtpDirect = async () => {
    setDebugResult('Testing direct POST /auth/v1/otp ...')

    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          email,
          create_user: true,
          gotrue_meta_security: {},
          code_challenge_method: 's256',
          data: {},
        }),
      })

      const text = await res.text()
      setDebugResult(`otp status=${res.status}\n${text}`)
      console.log('direct otp response', res.status, text)
    } catch (err) {
      console.error('direct otp failed', err)
      setDebugResult(
        `direct otp failed: ${err instanceof Error ? err.message : 'Unknown error'}`
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

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Mengirim...' : 'Kirim Magic Link'}
          </button>

          <button
            type="button"
            onClick={testOtpDirect}
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid #ccc',
              cursor: 'pointer',
              background: 'white',
            }}
          >
            Test Direct OTP
          </button>
        </div>
      </form>

      {message && <p style={{ marginTop: 16 }}>{message}</p>}

      <pre style={{ marginTop: 24, fontSize: 12, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(
          {
            origin: typeof window !== 'undefined' ? window.location.origin : null,
            supabaseUrl,
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