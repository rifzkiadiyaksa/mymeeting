'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const [loadingSend, setLoadingSend] = useState(false)
  const [loadingVerify, setLoadingVerify] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingSend(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
      })

      if (error) {
        setMessage(`Gagal kirim OTP: ${error.message}`)
      } else {
        setOtpSent(true)
        setMessage('Kode OTP sudah dikirim. Cek email kamu.')
      }
    } catch (err) {
      setMessage(
        `Gagal kirim OTP: ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    }

    setLoadingSend(false)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingVerify(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      })

      if (error) {
        setMessage(`Verifikasi gagal: ${error.message}`)
      } else {
        router.replace('/dashboard')
      }
    } catch (err) {
      setMessage(
        `Verifikasi gagal: ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    }

    setLoadingVerify(false)
  }

  return (
    <main style={{ padding: 40, maxWidth: 480 }}>
      <h1>Login</h1>
      <p>Masuk ke My Meeting App pakai kode OTP email.</p>

      <form onSubmit={handleSendOtp} style={{ marginTop: 20 }}>
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
          disabled={loadingSend}
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {loadingSend ? 'Mengirim...' : 'Kirim OTP'}
        </button>
      </form>

      {otpSent && (
        <form onSubmit={handleVerifyOtp} style={{ marginTop: 24 }}>
          <input
            type="text"
            placeholder="Masukkan 6 digit OTP"
            value={token}
            onChange={(e) => setToken(e.target.value)}
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
            disabled={loadingVerify}
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {loadingVerify ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </main>
  )
}