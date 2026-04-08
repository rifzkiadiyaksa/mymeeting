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

type Participant = {
  id: string
  user_email: string | null
  joined_at: string
}

export default function RoomPage({ params }: RoomPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [room, setRoom] = useState<Room | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])

  const fetchParticipants = async () => {
    const { data, error } = await supabase
      .from('room_participants')
      .select('*')
      .eq('room_id', params.id)
      .order('joined_at', { ascending: true })

    if (!error && data) {
      setParticipants(data)
    }
  }

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

      await supabase.from('room_participants').insert({
        room_id: params.id,
        user_id: session.user.id,
        user_email: session.user.email ?? null,
      })

      await fetchParticipants()
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

      <div style={{ marginTop: 24 }}>
        <h2>Participants</h2>

        {participants.length === 0 ? (
          <p>Belum ada participant.</p>
        ) : (
          participants.map((participant) => (
            <div
              key={participant.id}
              style={{
                marginBottom: 8,
                padding: 10,
                border: '1px solid #ddd',
                borderRadius: 8,
              }}
            >
              {participant.user_email ?? 'Unknown user'}
            </div>
          ))
        )}
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