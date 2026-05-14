import { useWebMCP } from '@mcp-b/react-webmcp'
import { z } from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { RESTAURANTS } from '../data'

export default function BookPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const restaurant = RESTAURANTS.find(r => r.id === state?.restaurant_id)
  const [form, setForm] = useState({ name: '', email: '', requests: '' })

  // Replaces the declarative <form tool-name="book_table"> approach
  useWebMCP({
    name: 'book_table',
    description: 'Reserve a table at the restaurant with guest details',
    inputSchema: {
      guest_name:       z.string().describe("Guest's full name"),
      email:            z.string().email().describe('Email address for confirmation'),
      special_requests: z.string().optional().describe('Dietary needs or seating preferences'),
    },
    handler: async ({ guest_name, email, special_requests }) => {
      const ref = 'RES-' + Math.floor(Math.random() * 9000 + 1000)
      navigate('/confirm', {
        state: {
          ...state,
          name: guest_name,
          email,
          requests: special_requests ?? '',
          ref,
        },
      })
      return { success: true, reservation_id: ref, restaurant: restaurant?.name, slot: state?.slot }
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    const ref = 'RES-' + Math.floor(Math.random() * 9000 + 1000)
    navigate('/confirm', { state: { ...state, ...form, ref } })
  }

  return (
    <div className="book-page">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← Back to restaurant
      </button>

      <div className="booking-header">
        <h1>Complete reservation</h1>
        <p className="booking-details">
          {restaurant?.name} · {state?.slot}
        </p>
      </div>

      {/* Regular HTML form for human users — MCP-B tools handled by useWebMCP hook */}
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="guest_name" className="form-label">Full name</label>
          <input
            id="guest_name"
            name="guest_name"
            className="form-input"
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            aria-describedby="name-help"
          />
          <span id="name-help" className="sr-only">Enter your full name for the reservation</span>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            id="email"
            name="email"
            className="form-input"
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            aria-describedby="email-help"
          />
          <span id="email-help" className="sr-only">Enter your email address for reservation confirmation</span>
        </div>

        <div className="form-group">
          <label htmlFor="special_requests" className="form-label">Special requests (optional)</label>
          <textarea
            id="special_requests"
            name="special_requests"
            className="form-textarea"
            placeholder="Window seat, vegetarian, accessibility needs…"
            value={form.requests}
            onChange={e => setForm(f => ({ ...f, requests: e.target.value }))}
            rows="3"
            aria-describedby="requests-help"
          />
          <span id="requests-help" className="sr-only">Optional: Specify any special requests or preferences</span>
        </div>

        <button type="submit" className="submit-button">Confirm reservation</button>
      </form>
    </div>
  )
}