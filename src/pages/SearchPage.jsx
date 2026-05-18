import { useWebMCP } from "@mcp-b/react-webmcp";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { RESTAURANTS } from "../data";

// ── Zod schemas — defined outside component, stable references ─────────────
// Zod automatically coerces incoming strings to the correct types,
// so "2" → 2 for z.number(), no manual casting needed.

const SEARCH_SCHEMA = {
  query: z
    .string()
    .describe(
      'Cuisine type or restaurant name to search for. Example: "French", "sushi", "Spice Route"'
    ),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")
    .describe(
      'Reservation date in YYYY-MM-DD format. Must be an exact date string. Example: "2026-05-20"'
    ),
  party_size: z
    .number()
    .min(1)
    .describe(
      "Number of guests dining. Must be a positive whole number. Example: 2"
    ),
};

const FILTER_SCHEMA = {
  name: z
    .string()
    .describe(
      'Partial restaurant name or cuisine to narrow results. Example: "spice", "Italian"'
    ),
};

const SELECT_SCHEMA = {
  restaurant_id: z
    .string()
    .describe(
      'Exact restaurant id from search_restaurants results. Example: "spice-route"'
    ),
};

// ── Shared search logic outside component — avoids stale closure in handler ─
// React guarantees state setters (setResults, setNameFilter) are stable,
// so passing them as args is safe.

function runSearch({query, date, setResults, setNameFilter}) {
  console.log({setResults})
  const matches = RESTAURANTS.filter(
    (restaurant) =>
      !query ||
    restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(query.toLowerCase())
  ).filter((restaurant) => !date || restaurant.availableDates.includes(date));

  setResults(matches);
  setNameFilter("");
  return matches;
}


export default function SearchPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [results, setResults] = useState(null); // null = not searched yet
  const [nameFilter, setNameFilter] = useState("");

  const visibleResults =
    results === null
      ? null
      : results.filter(
          (r) =>
            r.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
            r.cuisine.toLowerCase().includes(nameFilter.toLowerCase())
        );

  // ── Tool 1: search_restaurants ────────────────────────────────────────────

  useWebMCP({
    name: "search_restaurants",
    description:
      "Search available restaurants by cuisine or name, filtered by date and party size. " +
      "Returns a list of matching restaurants with their IDs, available dates, and time slots. " +
      "Call this first before trying to book — you need the restaurant ID from these results.",
    inputSchema: SEARCH_SCHEMA,
    handler: async ({ query, date, party_size }) => {
      // Zod has already validated and coerced all params here —
      // party_size is a number, date matches YYYY-MM-DD, query is a string.
      console.log("search_restaurants called", { query, date, party_size });

      setQuery(query);
      setDate(date);
      setPartySize(party_size);

      const matches = runSearch({ query, date, setResults, setNameFilter });

      if (matches.length === 0) {
        return {
          found: false,
          message: `No restaurants found for "${query}" on ${date} for ${party_size} guests. Try a different date or cuisine.`,
        };
      }

      return {
        found: true,
        count: matches.length,
        restaurants: matches.map((r) => ({
          id: r.id,
          name: r.name,
          cuisine: r.cuisine,
          price: r.price,
          availableDates: r.availableDates,
          slots: r.slots,
        })),
        next_step:
          "Call select_restaurant with a restaurant_id from the list above.",
      };
    },
  });

  // ── Tool 2: filter_restaurants_by_name ───────────────────────────────────
  // results state is read inside handler — stale closure is safe here because
  // @mcp-b/react-webmcp re-reads handler on every render via ref internally.

  useWebMCP({
    name: "filter_restaurants_by_name",
    description:
      "Narrows the visible restaurant list by name or cuisine. " +
      "Only works after search_restaurants has been called. " +
      'Example: call with name "Italian" to show only Italian restaurants.',
    inputSchema: FILTER_SCHEMA,
    handler: async ({ name }) => {
      if (results === null) {
        return {
          error: true,
          message: "No search has been run yet. Call search_restaurants first.",
        };
      }

      setNameFilter(name);

      const visible = results.filter(
        (r) =>
          r.name.toLowerCase().includes(name.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(name.toLowerCase())
      );

      return {
        filter: name,
        count: visible.length,
        restaurants: visible.map((r) => ({
          id: r.id,
          name: r.name,
          cuisine: r.cuisine,
        })),
      };
    },
  });

  // ── Tool 3: select_restaurant ─────────────────────────────────────────────

  useWebMCP({
    name: "select_restaurant",
    description:
      "Navigate to a restaurant detail page. " +
      "Call this after search_restaurants returns results and you have a restaurant_id.",
    inputSchema: SELECT_SCHEMA,
    handler: async ({ restaurant_id }) => {
      const match = RESTAURANTS.find((r) => r.id === restaurant_id);

      if (!match) {
        return {
          error: true,
          message: `Restaurant "${restaurant_id}" not found. Use an id from search_restaurants results.`,
        };
      }

      navigate(`/restaurant/${restaurant_id}`);

      return {
        success: true,
        navigating_to: match.name,
      };
    },
  });


  function handleSubmit(e) {
    e.preventDefault();
    runSearch({query, date, setResults, setNameFilter});
  }


  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Find a table</h1>
        <p>Fill in the details and hit Search to see available restaurants.</p>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <label className="field" htmlFor="query">
          <span className="field-label">Cuisine or restaurant</span>
          <input
            id="query"
            className="search-input"
            placeholder="French, sushi, Italian…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <label className="field" htmlFor="date">
          <span className="field-label">Date</span>
          <input
            id="date"
            className="search-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="field" htmlFor="party_size">
          <span className="field-label">Party size</span>
          <input
            id="party_size"
            className="search-input"
            type="number"
            min="1"
            max="10"
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
          />
        </label>

        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {results !== null && (
        <div className="restaurant-list-panel">
          {results.length > 1 && (
            <div className="filter-bar">
              <label className="field" htmlFor="name-filter">
                <span className="field-label">Filter results</span>
                <input
                  id="name-filter"
                  className="search-input"
                  placeholder="Narrow by name or cuisine…"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </label>
              {nameFilter && (
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => setNameFilter("")}
                >
                  Clear ✕
                </button>
              )}
            </div>
          )}

          <p className="section-heading">
            {visibleResults.length === 0
              ? "No matches"
              : `${visibleResults.length} restaurant${
                  visibleResults.length !== 1 ? "s" : ""
                } found`}
          </p>

          {visibleResults.length === 0 ? (
            <p className="no-results">
              No restaurants match. Try adjusting the date or cuisine.
            </p>
          ) : (
            <ul className="restaurant-list">
              {visibleResults.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className="restaurant-badge"
                    onClick={() => navigate(`/restaurant/${r.id}`)}
                  >
                    <div className="restaurant-badge-main">
                      <strong>{r.name}</strong>
                      <span className="restaurant-meta-text">
                        {r.cuisine} · {r.price}
                      </span>
                    </div>
                    <div className="restaurant-badge-dates">
                      {r.availableDates.slice(0, 3).map((d) => (
                        <span key={d} className="date-chip">
                          {d}
                        </span>
                      ))}
                      {r.availableDates.length > 3 && (
                        <span className="date-chip date-chip-more">
                          +{r.availableDates.length - 3} more
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
