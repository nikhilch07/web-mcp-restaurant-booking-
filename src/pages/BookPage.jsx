import { useWebMCP } from "@mcp-b/react-webmcp";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { RESTAURANTS } from "../data";

// ── Zod schema — defined outside component, stable reference ───────────────

const BOOK_TABLE_SCHEMA = {
  guest_name: z
    .string()
    .min(1)
    .describe(
      'Full name of the guest making the reservation. Example: "Jane Smith"'
    ),
  email: z
    .string()
    .email()
    .describe(
      'Email address for the booking confirmation. Example: "jane@example.com"'
    ),
  special_requests: z
    .string()
    .optional()
    .describe(
      'Dietary needs or seating preferences. Optional. Example: "window seat, vegetarian"'
    ),
};

// ── Component ──────────────────────────────────────────────────────────────

export default function BookPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const restaurant = RESTAURANTS.find((r) => r.id === state?.restaurant_id);
  const [form, setForm] = useState({ name: "", email: "", requests: "" });

  // ── Tool: book_table ─────────────────────────────────────────────────────

  useWebMCP({
    name: "book_table",
    description:
      "Complete a restaurant reservation with guest details. " +
      "Call this after select_slot — requires guest name and email. " +
      "Returns a reservation reference number on success.",
    inputSchema: BOOK_TABLE_SCHEMA,
    handler: async ({ guest_name, email, special_requests }) => {
      console.log("book_table called", { guest_name, email, special_requests });

      if (!state?.restaurant_id || !state?.slot) {
        return {
          error: true,
          message:
            "No restaurant or slot selected. Call select_slot first before booking.",
        };
      }

      const ref = "RES-" + Math.floor(Math.random() * 9000 + 1000);

      navigate("/confirm", {
        state: {
          ...state,
          name: guest_name,
          email,
          requests: special_requests ?? "",
          ref,
        },
      });

      return {
        success: true,
        reservation_id: ref,
        restaurant: restaurant?.name,
        slot: state?.slot,
        guest: guest_name,
        next_step:
          "Reservation complete. You can use modify_reservation or cancel_reservation on the confirmation page.",
      };
    },
  });

  // ── Form submit handler (human users) ─────────────────────────────────────

  function handleSubmit(e) {
    e.preventDefault();
    const ref = "RES-" + Math.floor(Math.random() * 9000 + 1000);
    navigate("/confirm", { state: { ...state, ...form, ref } });
  }

  // ── Render ────────────────────────────────────────────────────────────────

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

      {/* Regular HTML form for human users — agent path handled by useWebMCP above */}
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="guest_name" className="form-label">
            Full name
          </label>
          <input
            id="guest_name"
            name="guest_name"
            className="form-input"
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            aria-describedby="name-help"
          />
          <span id="name-help" className="sr-only">
            Enter your full name for the reservation
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            name="email"
            className="form-input"
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            aria-describedby="email-help"
          />
          <span id="email-help" className="sr-only">
            Enter your email address for reservation confirmation
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="special_requests" className="form-label">
            Special requests (optional)
          </label>
          <textarea
            id="special_requests"
            name="special_requests"
            className="form-textarea"
            placeholder="Window seat, vegetarian, accessibility needs…"
            value={form.requests}
            onChange={(e) =>
              setForm((f) => ({ ...f, requests: e.target.value }))
            }
            rows="3"
            aria-describedby="requests-help"
          />
          <span id="requests-help" className="sr-only">
            Optional: Specify any special requests or preferences
          </span>
        </div>

        <button type="submit" className="submit-button">
          Confirm reservation
        </button>
      </form>
    </div>
  );
}
