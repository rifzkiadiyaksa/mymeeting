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