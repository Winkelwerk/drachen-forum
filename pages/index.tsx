import { useEffect, useState } from 'react'

type Post = {
  id: number
  title: string
  content?: string
  createdAt: string
  media: { url: string }[]
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then((data) => setPosts(data))
  }, [])

  async function submit(e: any) {
    e.preventDefault()
    let mediaUrl: string | undefined
    if (file) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/uploads', { method: 'POST', body: fd })
      const j = await res.json()
      mediaUrl = j.url
    }
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, mediaUrl })
    })
    setTitle('')
    setContent('')
    setFile(null)
    const r = await fetch('/api/posts')
    setPosts(await r.json())
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Drachen Forum — Feed</h1>
      <form onSubmit={submit} style={{ marginBottom: 20 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel" required />
        <br />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Beitrag" />
        <br />
        <input type="file" accept="video/*,image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <br />
        <button type="submit">Erstellen</button>
      </form>

      <section>
        {posts.map((p) => (
          <article key={p.id} style={{ border: '1px solid #ddd', marginBottom: 10, padding: 10 }}>
            <h2>{p.title}</h2>
            <p>{p.content}</p>
            {p.media.map((m, i) => (
              <div key={i}>
                {m.url.endsWith('.mp4') ? (
                  <video src={m.url} controls style={{ maxWidth: '100%' }} />
                ) : (
                  <img src={m.url} alt="media" style={{ maxWidth: '100%' }} />
                )}
              </div>
            ))}
            <small>{new Date(p.createdAt).toLocaleString()}</small>
          </article>
        ))}
      </section>
    </div>
  )
}
