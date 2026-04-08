'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase/client'

type UserInfo = {
  email: string | null
}

type Room = {
  id: string
  name: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [roomName, setRoomName] = useState('')
  const [rooms, setRooms] = useState<Room[]>([])

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch rooms error:', error.message)
      return
    }

    if (data) {
      setRooms(data)
    }
  }

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

      await fetchRooms()
      setLoading(false)
    }

    checkSession()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const createRoom = async () => {
    if (!roomName.trim()) return

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const { error } = await supabase.from('rooms').insert({
      name: roomName.trim(),
      created_by: session?.user.id ?? null,
    })

    if (error) {
      alert(`Gagal buat room: ${error.message}`)
      return
    }

    setRoomName('')
    await fetchRooms()
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

      <div style={{ marginTop: 32 }}>
        <h2>Buat Room</h2>

        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Nama meeting"
          style={{
            padding: 10,
            marginRight: 10,
            border: '1px solid #ccc',
            borderRadius: 8,
          }}
        />

        <button
          onClick={createRoom}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #ccc',
            cursor: 'pointer',
            background: 'white',
          }}
        >
          Create Room
        </button>
      </div>

      <div style={{ marginTop: 32 }}>
        <h2>Daftar Room</h2>

        {rooms.length === 0 ? (
          <p>Belum ada room.</p>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              style={{
                marginBottom: 12,
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 8,
              }}
            >
              <strong>{room.name}</strong>
              <div style={{ fontSize: 12, marginTop: 4 }}>{room.id}</div>

              <a
                href={`/room/${room.id}`}
                style={{
                  display: 'inline-block',
                  marginTop: 10,
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: 'black',
                }}
              >
                Join Room
              </a>
            </div>
          ))
        )}
      </div>
    </main>
  )
}