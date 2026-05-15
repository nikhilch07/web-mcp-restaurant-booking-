import { useWebMCP } from "usewebmcp";
import { useNavigate, useParams } from "react-router-dom";
import { RESTAURANTS } from "../data";

const GET_AVAILABILITY_SCHEMA = {
  type: "object",
  properties: {
    restaurant_id: { type: "string", description: "Restaurant identifier" },
    date: { type: "string", description: "Date in YYYY-MM-DD format" },
    party_size: { type: "number", description: "Number of guests" },
  },
  required: ["query", "date", "party_size"],
};

const SELECT_SLOT_SCHEMA = {
  type: "object",
  properties: {
    restaurant_id: { type: "string", description: "Restaurant identifier" },
    slot: { type: "string", description: 'Time slot e.g. "7:30 pm' },
  },
};
export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = RESTAURANTS.find((r) => r.id === id);

  // Registers on mount, unregisters on unmount — no useEffect needed
  useWebMCP({
    name: "get_availability",
    description: "Get available time slots for a restaurant on a given date",
    inputSchema: GET_AVAILABILITY_SCHEMA,
    handler: async ({ restaurant_id }) => {
      const r = RESTAURANTS.find((x) => x.id === restaurant_id);
      return { slots: r?.slots ?? [], restaurant_id };
    },
  });

  useWebMCP({
    name: "select_slot",
    description: "Select a time slot and go to the booking form",
    inputSchema: SELECT_SLOT_SCHEMA,
    handler: async ({ restaurant_id, slot }) => {
      navigate("/book", { state: { restaurant_id, slot } });
      return { success: true };
    },
  });

  if (!restaurant) return <p>Not found</p>;

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
