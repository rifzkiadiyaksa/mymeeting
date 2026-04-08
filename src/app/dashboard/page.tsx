'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase/client'

type UserInfo = {
  email: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
        return
      }

      setUserInfo({
        email: session.user.email ?? null,
      })
      setLoading(false)
    }

    checkSession()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (loading) {
    return (
      <main style={{ padding: 40 }}>
        <p>Loading dashboard...</p>
      </main>
    )
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <p>Login berhasil.</p>
      <p style={{ marginTop: 8 }}>
        Email: <strong>{userInfo?.email}</strong>
      </p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: 20,
          padding: '12px 16px',
          borderRadius: 8,
          border: '1px solid #ccc',
          cursor: 'pointer',
          background: 'white',
        }}
      >
        Logout
      </button>
    </main>
  )
}