import { useWebMCP } from '@mcp-b/react-webmcp'
import { z } from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { RESTAURANTS } from '../data'

export default function ConfirmPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const restaurant = RESTAURANTS.find(r => r.id === state?.restaurant_id)

  useWebMCP({
    name: 'modify_reservation',
    description: 'Change the time slot of an existing reservation',
    inputSchema: {
      reservation_id: z.string(),
      new_slot: z.string().optional(),
    },
    handler: async ({ new_slot }) => {
      navigate('/book', { state: { ...state, slot: new_slot ?? state.slot } })
      return { success: true }
    },
  })

  useWebMCP({
    name: 'cancel_reservation',
    description: 'Cancel the current reservation and return to search',
    inputSchema: {
      reservation_id: z.string(),
    },
    handler: async () => {
      navigate('/')
      return { success: true, message: 'Reservation cancelled' }
    },
  })

  return (
    <div className="confirm-page">
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h1>Reservation Confirmed!</h1>
        <p className="confirmation-subtitle">Your table has been successfully booked. Details below.</p>
      </div>

      <div className="reservation-details">
        <section className="booking-summary">
          <h2>Booking Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Restaurant</span>
              <span className="summary-value">{restaurant?.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Cuisine</span>
              <span className="summary-value">{restaurant?.cuisine}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Price Tier</span>
              <span className="summary-value">{restaurant?.price}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Date & Time</span>
              <span className="summary-value">{state?.slot}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Reference Number</span>
              <span className="summary-value confirmation-ref">{state?.ref}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Booking Time</span>
              <span className="summary-value">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </section>

        <section className="guest-details">
          <h2>Guest Details</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{state?.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <span className="detail-value">{state?.email}</span>
            </div>
            {state?.requests && (
              <div className="detail-item full-width">
                <span className="detail-label">Special Requests</span>
                <span className="detail-value">{state.requests}</span>
              </div>
            )}
          </div>
        </section>

        <section className="confirmation-actions">
          <p className="confirmation-note">
            A confirmation email has been sent to <strong>{state?.email}</strong> with these details.
          </p>
          <div className="action-buttons">
            <button
              type="button"
              className="primary-button"
              onClick={() => navigate('/')}
            >
              Make Another Reservation
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate(-1)}
            >
              Back to Booking
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}