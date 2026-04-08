type RoomPageProps = {
  params: {
    id: string
  }
}

export default function RoomPage({ params }: RoomPageProps) {
  return (
    <main style={{ padding: 40 }}>
      <h1>Meeting Room</h1>
      <p>Room ID: {params.id}</p>
      <p>Halaman ini nanti akan dipakai untuk video meeting.</p>

      <a
        href="/dashboard"
        style={{
          display: 'inline-block',
          marginTop: 20,
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