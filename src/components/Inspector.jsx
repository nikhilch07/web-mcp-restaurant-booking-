import { useEffect, useState } from 'react'

export default function Inspector() {
  const [tools, setTools] = useState([])
  const [shimReady, setShimReady] = useState(false)

  useEffect(() => {
    function syncTools() {
      const t = navigator.modelContextTesting?.listTools() ?? []
      setTools(t)
    }

    function tryAttach() {
      const testing = navigator.modelContextTesting

      if (!testing) {
        // Shim not ready yet — retry in 100ms
        setTimeout(tryAttach, 100)
        return
      }

      setShimReady(true)
      syncTools()

      if (typeof testing.registerToolsChangedCallback === 'function') {
        testing.registerToolsChangedCallback(syncTools)
      } else {
        // Fallback: poll every 500ms if callback API is unavailable
        const id = setInterval(syncTools, 500)
        return () => clearInterval(id)
      }
    }

    tryAttach()
  }, [])

  async function handleCall(tool) {
    const raw = prompt(`JSON args for ${tool.name}:`, '{}')
    try {
      const result = await navigator.modelContextTesting?.executeTool(
        tool.name,
        raw ?? '{}'
      )
      alert(`Result:\n${result}`)
    } catch (err) {
      alert(`Error: ${err.message}`)
    }
  }

  return (
    <div style={{ borderLeft: '1px solid #eee', padding: 16, background: '#fafafa', overflowY: 'auto' }}>
      <h3>WebMCP Inspector</h3>
      {!shimReady && (
        <p style={{ fontSize: 12, color: '#aaa' }}>Waiting for modelContextTesting…</p>
      )}
      <p style={{ fontSize: 12, color: '#888' }}>
        {tools.length} tool{tools.length !== 1 ? 's' : ''} on this page
      </p>
      {tools.map(tool => (
        <div key={tool.name} style={{ marginBottom: 12, padding: 10, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8 }}>
          <code style={{ fontWeight: 600 }}>{tool.name}</code>
          <p style={{ fontSize: 12, color: '#555', margin: '4px 0' }}>{tool.description}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
            {Object.keys(tool.inputSchema?.properties ?? {}).map(p => (
              <span key={p} style={{ fontSize: 11, background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>{p}</span>
            ))}
          </div>
          <button onClick={() => handleCall(tool)}>Call ▶</button>
        </div>
      ))}
    </div>
  )
}