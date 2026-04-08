'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase/client'

type RoomPageProps = {
  params: {
    id: string
  }
}

type Room = {
  id: string
  name: string
  created_at: string
}

export default function RoomPage({ params }: RoomPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [room, setRoom] = useState<Room | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const loadRoom = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
        return
      }

      setUserEmail(session.user.email ?? null)

      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error || !data) {
        router.replace('/dashboard')
        return
      }

      setRoom(data)
      setLoading(false)
    }

    loadRoom()
  }, [params.id, router])

  if (loading) {
    return (
      <main style={{ padding: 40 }}>
        <p>Loading room...</p>
      </main>
    )
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Meeting Room</h1>

      <div style={{ marginTop: 16 }}>
        <p>
          <strong>Room Name:</strong> {room?.name}
        </p>
        <p>
          <strong>Room ID:</strong> {room?.id}
        </p>
        <p>
          <strong>User:</strong> {userEmail}
        </p>
      </div>

      <div
        style={{
          marginTop: 32,
          padding: 20,
          border: '1px solid #ddd',
          borderRadius: 12,
        }}
      >
        <h2>Meeting Stage</h2>
        <p>Area ini nanti dipakai untuk video grid, mic/cam controls, dan screen share.</p>
      </div>

      <div
        style={{
          marginTop: 24,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <button
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #ccc',
            background: 'white',
            cursor: 'pointer',
          }}
        >
          Toggle Mic
        </button>

        <button
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #ccc',
            background: 'white',
            cursor: 'pointer',
          }}
        >
          Toggle Camera
        </button>

        <button
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #ccc',
            background: 'white',
            cursor: 'pointer',
          }}
        >
          Share Screen
        </button>
      </div>

      <a
        href="/dashboard"
        style={{
          display: 'inline-block',
          marginTop: 24,
          padding: '10px 14px',
          border: '1px solid #ccc',
          borderRadius: 8,
          textDecoration: 'none',
          color: 'black',
        }}
      >
        Back to Dashboard
      </a>
    </main>
  )
}