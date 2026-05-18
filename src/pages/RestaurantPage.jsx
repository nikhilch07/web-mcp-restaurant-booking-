import { useWebMCP } from "@mcp-b/react-webmcp";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { RESTAURANTS } from "../data";

// ── Zod schemas — defined outside component, stable references ─────────────

const GET_AVAILABILITY_SCHEMA = {
  restaurant_id: z
    .string()
    .describe(
      'Restaurant identifier from search results. Example: "spice-route"'
    ),
  date: z
    .string()
    .describe('Reservation date in YYYY-MM-DD format. Example: "2026-05-20"'),
  party_size: z
    .number()
    .min(1)
    .describe("Number of guests dining. Must be a positive number. Example: 2"),
};

const SELECT_SLOT_SCHEMA = {
  restaurant_id: z
    .string()
    .describe(
      'Restaurant identifier from search results. Example: "spice-route"'
    ),
  slot: z
    .string()
    .describe(
      'Exact time slot string from get_availability results. Example: "7:30 pm"'
    ),
};

// ── Component ──────────────────────────────────────────────────────────────

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = RESTAURANTS.find((r) => r.id === id);

  // ── Tool 1: get_availability ─────────────────────────────────────────────

  useWebMCP({
    name: "get_availability",
    description:
      "Get available time slots for a restaurant on a given date. " +
      "Call this after select_restaurant to see what times are bookable. " +
      "Returns a list of slot strings to pass to select_slot.",
    inputSchema: GET_AVAILABILITY_SCHEMA,
    handler: async ({ restaurant_id, date, party_size }) => {
      console.log("get_availability called", { restaurant_id, date, party_size });

      const r = RESTAURANTS.find((x) => x.id === restaurant_id);

      if (!r) {
        return {
          error: true,
          message: `Restaurant "${restaurant_id}" not found. Use an id from search_restaurants results.`,
        };
      }

      return {
        restaurant_id,
        restaurant_name: r.name,
        date,
        party_size,
        slots: r.slots,
        next_step:
          "Call select_slot with one of the slot strings above and the restaurant_id.",
      };
    },
  });

  // ── Tool 2: select_slot ──────────────────────────────────────────────────

  useWebMCP({
    name: "select_slot",
    description:
      "Select a time slot and navigate to the booking form. " +
      "Call this after get_availability returns available slots. " +
      'Pass the exact slot string from the results. Example: "7:30 pm"',
    inputSchema: SELECT_SLOT_SCHEMA,
    handler: async ({ restaurant_id, slot }) => {
      console.log("select_slot called", { restaurant_id, slot });

      const r = RESTAURANTS.find((x) => x.id === restaurant_id);

      if (!r) {
        return {
          error: true,
          message: `Restaurant "${restaurant_id}" not found. Use an id from search_restaurants results.`,
        };
      }

      if (!r.slots.includes(slot)) {
        return {
          error: true,
          message: `Slot "${slot}" is not available. Available slots: ${r.slots.join(", ")}`,
        };
      }

      navigate("/book", { state: { restaurant_id, slot } });

      return {
        success: true,
        navigating_to: "booking form",
        restaurant: r.name,
        slot,
      };
    },
  });

  if (!restaurant) return <p>Not found</p>;

  return (
    <div className="restaurant-page">
      
      <section className="restaurant-hero">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← Back to search
      </button>
        <span className="restaurant-tag">{restaurant.cuisine}</span>

        <div className="restaurant-info">
          <h1>{restaurant.name}</h1>
          <p className="restaurant-subtitle">
            A polished dining experience with carefully curated seating and
            flexible reservation times.
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
          <p>
            Choose the best reservation time for your visit and continue to
            booking.
          </p>
        </div>

        <div className="slots-grid">
          {restaurant.slots.map((s) => (
            <button
              key={s}
              type="button"
              className="slot-button"
              onClick={() =>
                navigate("/book", { state: { restaurant_id: id, slot: s } })
              }
            >
              {s}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
