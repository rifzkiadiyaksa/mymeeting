export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      <h1>My Meeting App 🚀</h1>
      <p>Aplikasi meeting sedang dibangun.</p>

      <a
        href="/login"
        style={{
          display: 'inline-block',
          marginTop: 20,
          padding: '12px 16px',
          border: '1px solid #ccc',
          borderRadius: 8,
          textDecoration: 'none',
          color: 'black',
        }}
      >
        Login
      </a>
    </main>
  )
}