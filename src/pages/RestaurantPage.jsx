import { useWebMCP } from '@mcp-b/react-webmcp'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { RESTAURANTS } from '../data'

export default function RestaurantPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const restaurant = RESTAURANTS.find(r => r.id === id)

  // Registers on mount, unregisters on unmount — no useEffect needed
  useWebMCP({
    name: 'get_availability',
    description: 'Get available time slots for a restaurant on a given date',
    inputSchema: {
      restaurant_id: z.string().describe('Restaurant identifier'),
      date: z.string().describe('Date in YYYY-MM-DD format'),
      party_size: z.number().describe('Number of guests'),
    },
    handler: async ({ restaurant_id }) => {
      const r = RESTAURANTS.find(x => x.id === restaurant_id)
      return { slots: r?.slots ?? [], restaurant_id }
    },
  })

  useWebMCP({
    name: 'select_slot',
    description: 'Select a time slot and go to the booking form',
    inputSchema: {
      restaurant_id: z.string(),
      slot: z.string().describe('Time slot e.g. "7:30 pm"'),
    },
    handler: async ({ restaurant_id, slot }) => {
      navigate('/book', { state: { restaurant_id, slot } })
      return { success: true }
    },
  })

  if (!restaurant) return <p>Not found</p>

  return (
    <div className="restaurant-page">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← Back to search
      </button>

      <section className="restaurant-hero">
        <span className="restaurant-tag">{restaurant.cuisine}</span>

        <div className="restaurant-info">
          <h1>{restaurant.name}</h1>
          <p className="restaurant-subtitle">
            A polished dining experience with carefully curated seating and flexible reservation times.
          </p>

          <div className="restaurant-meta">
            <span>{restaurant.price} price tier</span>
            <span>{restaurant.slots.length} time slots available</span>
          </div>
        </div>
      </section>

      <section className="slots-panel">
        <div className="slots-heading">
          <h2>Available time slots</h2>
          <p>Choose the best reservation time for your visit and continue to booking.</p>
        </div>

        <div className="slots-grid">
          {restaurant.slots.map(s => (
            <button
              key={s}
              type="button"
              className="slot-button"
              onClick={() => navigate('/book', { state: { restaurant_id: id, slot: s } })}
            >
              {s}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
