import { useWebMCP } from "@mcp-b/react-webmcp";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { RESTAURANTS } from "../data";

// ── Zod schemas — defined outside component, stable references ─────────────

const MODIFY_RESERVATION_SCHEMA = {
  reservation_id: z
    .string()
    .describe(
      'Reference number of the reservation to modify. Example: "RES-20260520-1234"'
    ),
  new_slot: z
    .string()
    .describe(
      'New time slot to switch to. Must be a valid slot for the restaurant. Example: "8:00 pm"'
    ),
};

const CANCEL_RESERVATION_SCHEMA = {
  reservation_id: z
    .string()
    .describe(
      'Reference number of the reservation to cancel. Example: "RES-20260520-1234"'
    ),
};


export default function ConfirmPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const restaurant = RESTAURANTS.find((r) => r.id === state?.restaurant_id);

  return (
    <div className="confirm-page">
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h1>Reservation Confirmed!</h1>
        <p className="confirmation-subtitle">
          Your table has been successfully booked. Details below.
        </p>
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
            A confirmation email has been sent to{" "}
            <strong>{state?.email}</strong> with these details.
          </p>
          <div className="action-buttons">
            <button
              type="button"
              className="primary-button"
              onClick={() => navigate("/")}
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
  );
}
