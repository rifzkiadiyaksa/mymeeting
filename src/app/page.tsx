import { supabase } from '../lib/supabase/client'

export default async function Home() {
  const { data, error } = await supabase.auth.getSession()

  return (
    <main style={{ padding: 40 }}>
      <h1>My Meeting App 🚀</h1>
      <p>Supabase connected: {error ? 'No' : 'Yes'}</p>
      <pre style={{ marginTop: 16 }}>
        {JSON.stringify(
          {
            hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            session: data.session ? 'exists' : 'null',
          },
          null,
          2
        )}
      </pre>
    </main>
  )
}