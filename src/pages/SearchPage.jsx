import { useWebMCP } from "usewebmcp";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RESTAURANTS } from "../data";

const SEARCH_SCHEMA = {
  type: "object",
  properties: {
    query: { type: "string", description: "Cuisine type or restaurant name" },
    date: { type: "string", description: "Date in YYYY-MM-DD format" },
    party_size: { type: "number", description: "Number of guests" },
  },
  required: ["query", "date", "party_size"],
};

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // Register MCP-B tool for restaurant search
  useWebMCP({
    name: "search_restaurants",
    description:
      "Search available restaurants by cuisine, date, and party size",
    inputSchema: SEARCH_SCHEMA,
    handler: async ({ query, date, party_size }) => {
      // For demo purposes, navigate to a restaurant
      navigate("/restaurant/mcd");
      return {
        success: true,
        message: `Searching for ${query} restaurants on ${date} for ${party_size} guests`,
      };
    },
  });

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Find a table</h1>
        <p>
          Search restaurants by cuisine, date, and party size. Use the fields
          below to refine your results and pick a restaurant quickly.
        </p>
      </div>

      {/* Regular HTML form for human users — MCP-B tools handled by useWebMCP hook */}
      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/restaurant/mcd");
        }}
      >
        <label className="field" htmlFor="query">
          <span className="field-label">Cuisine or restaurant</span>
          <input
            id="query"
            className="search-input"
            name="query"
            placeholder="French, sushi, Italian…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <label className="field" htmlFor="date">
          <span className="field-label">Date</span>
          <input id="date" className="search-input" name="date" type="date" />
        </label>

        <label className="field" htmlFor="party_size">
          <span className="field-label">Party size</span>
          <input
            id="party_size"
            className="search-input"
            name="party_size"
            type="number"
            min="1"
            max="10"
            defaultValue={2}
          />
        </label>

        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      <div className="restaurant-list-panel">
        <p className="section-heading">Popular restaurants</p>
        <ul className="restaurant-list">
          {RESTAURANTS.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                className="restaurant-badge"
                onClick={() => navigate(`/restaurant/${r.id}`)}
              >
                <strong>{r.name}</strong>
                <span className="restaurant-meta-text">
                  {r.cuisine} · {r.price}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
