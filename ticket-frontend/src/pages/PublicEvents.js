import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/shared/loader/Loader";
import { useToast } from "../context/ToastContext";
import { AuthContext } from "../context/AuthContext";
import { apiUrl, mediaUrl } from "../config/api";
import Footer from "../components/Footer";

const PublicEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("soonest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    category: "",
    location: "",
    priceMin: "",
    priceMax: "",
  });

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(apiUrl("/api/v1/Event/all-events"));
        const payload = res.data;
        const eventData = Array.isArray(payload?.events)
          ? payload.events
          : Array.isArray(payload)
            ? payload
            : [];
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
        showToast("Failed to load events.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [showToast]);

  const categories = useMemo(() => {
    const unique = new Set();
    for (const event of events) {
      const value = (event?.category ?? "").toString().trim();
      if (value) unique.add(value);
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [events]);

  const locations = useMemo(() => {
    const unique = new Set();
    for (const event of events) {
      const value = (event?.location ?? "").toString().trim();
      if (value) unique.add(value);
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [events]);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const categoryFilter = filters.category.trim().toLowerCase();
    const locationFilter = filters.location.trim().toLowerCase();

    const startMs = filters.dateFrom ? new Date(filters.dateFrom + "T00:00:00").getTime() : null;
    const endMs = filters.dateTo ? new Date(filters.dateTo + "T23:59:59.999").getTime() : null;

    const minPrice =
      filters.priceMin !== "" && Number.isFinite(Number(filters.priceMin))
        ? Number(filters.priceMin)
        : null;
    const maxPrice =
      filters.priceMax !== "" && Number.isFinite(Number(filters.priceMax))
        ? Number(filters.priceMax)
        : null;

    const filtered = events.filter((event) => {
        const eventName = (event?.eventname ?? "").toString().toLowerCase();
        const eventPlace = (event?.place ?? "").toString().toLowerCase();
        const eventLocation = (event?.location ?? "").toString().toLowerCase();
        const eventCategory = (event?.category ?? "").toString().toLowerCase();
        const eventOther = (event?.other ?? "").toString().toLowerCase();
        const eventDescription = (event?.description ?? "").toString().toLowerCase();

        const eventDateMs = event?.date ? new Date(event.date).getTime() : null;
        const eventPrice = Number(event?.ticketprice);

        if (normalizedSearch) {
          const matches =
            eventName.includes(normalizedSearch) ||
            eventPlace.includes(normalizedSearch) ||
            eventLocation.includes(normalizedSearch) ||
            eventCategory.includes(normalizedSearch) ||
            eventOther.includes(normalizedSearch) ||
            eventDescription.includes(normalizedSearch);
          if (!matches) return false;
        }

        if (categoryFilter && eventCategory !== categoryFilter) return false;

        if (locationFilter) {
          const matchesLocation = eventLocation.includes(locationFilter) || eventPlace.includes(locationFilter);
          if (!matchesLocation) return false;
        }

        if (startMs !== null) {
          if (eventDateMs === null || Number.isNaN(eventDateMs) || eventDateMs < startMs) return false;
        }

        if (endMs !== null) {
          if (eventDateMs === null || Number.isNaN(eventDateMs) || eventDateMs > endMs) return false;
        }

        if (minPrice !== null) {
          if (!Number.isFinite(eventPrice) || eventPrice < minPrice) return false;
        }

        if (maxPrice !== null) {
          if (!Number.isFinite(eventPrice) || eventPrice > maxPrice) return false;
        }

        return true;
      });

    return filtered.slice().sort((a, b) => {
      const aDate = a?.date ? new Date(a.date).getTime() : 0;
      const bDate = b?.date ? new Date(b.date).getTime() : 0;
      const aPrice = Number(a?.ticketprice);
      const bPrice = Number(b?.ticketprice);

      switch (sortBy) {
        case "latest":
          return bDate - aDate;
        case "priceLow":
          return (Number.isFinite(aPrice) ? aPrice : Infinity) - (Number.isFinite(bPrice) ? bPrice : Infinity);
        case "priceHigh":
          return (Number.isFinite(bPrice) ? bPrice : -Infinity) - (Number.isFinite(aPrice) ? aPrice : -Infinity);
        case "soonest":
        default:
          return aDate - bDate;
      }
    });
  }, [events, filters, searchTerm, sortBy]);

  const appliedFilters = useMemo(() => {
    const chips = [];

    const normalizedSearch = searchTerm.trim();
    if (normalizedSearch) chips.push({ key: "search", label: `Search: ${normalizedSearch}` });

    if (filters.category) chips.push({ key: "category", label: `Category: ${filters.category}` });
    if (filters.location) chips.push({ key: "location", label: `Location: ${filters.location}` });
    if (filters.dateFrom) chips.push({ key: "dateFrom", label: `From: ${filters.dateFrom}` });
    if (filters.dateTo) chips.push({ key: "dateTo", label: `To: ${filters.dateTo}` });
    if (filters.priceMin) chips.push({ key: "priceMin", label: `Min: Ksh ${filters.priceMin}` });
    if (filters.priceMax) chips.push({ key: "priceMax", label: `Max: Ksh ${filters.priceMax}` });

    return chips;
  }, [filters, searchTerm]);

  const onSubmitSearch = (e) => {
    e.preventDefault();
  };

  const onClearFilters = () => {
    setSearchTerm("");
    setSortBy("soonest");
    setFilters({
      dateFrom: "",
      dateTo: "",
      category: "",
      location: "",
      priceMin: "",
      priceMax: "",
    });
  };

  const onRemoveChip = (key) => {
    if (key === "search") {
      setSearchTerm("");
      return;
    }

    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center" style={{ paddingTop: 80 }}>
        <Loader/>
      </div>
    );
  }

  return (
   <div>


 <div className="bg-light min-vh-100" style={{ paddingTop: 80 }}>
      <div className="container py-4">
        <div className="bg-white border rounded-4 shadow-sm p-4 p-md-5 mb-4">
          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-end justify-content-between gap-3">
            <div>
              <span className="badge text-bg-primary-subtle text-primary fw-semibold">
                Browse &amp; book in minutes
              </span>
              <h1 className="display-6 fw-bold mt-3 mb-2">Explore Events</h1>
              <p className="text-secondary mb-0">
                Find the perfect experience. Filter by date, category, location, and price.
              </p>
            </div>
            <div className="text-secondary">
              Showing <span className="fw-semibold text-dark">{filteredEvents.length}</span> of{" "}
              <span className="fw-semibold text-dark">{events.length}</span>
            </div>
          </div>

          <form className="mt-4" onSubmit={onSubmitSearch}>
            <div className="row g-2 align-items-end">
              <div className="col-12 col-lg">
                <label className="form-label fw-semibold">Search</label>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events (name, place, description...)"
                  className="form-control form-control-lg"
                />
              </div>

              <div className="col-6 col-md-4 col-lg-2">
                <label className="form-label fw-semibold">Sort</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select form-select-lg"
                >
                  <option value="soonest">Soonest</option>
                  <option value="latest">Latest</option>
                  <option value="priceLow">Price: Low</option>
                  <option value="priceHigh">Price: High</option>
                </select>
              </div>

              <div className="col-6 col-md-4 col-lg-2">
                <button type="submit" className="btn btn-primary btn-lg w-100">
                  Search
                </button>
              </div>
              <div className="col-12 col-md-4 col-lg-2">
                <button type="button" onClick={onClearFilters} className="btn btn-outline-secondary btn-lg w-100">
                  Reset
                </button>
              </div>
            </div>

            {categories.length > 0 && (
              <div className="mt-3 d-flex flex-wrap gap-2 align-items-center">
                <span className="text-secondary small fw-semibold me-1">Quick categories:</span>
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, category: "" }))}
                  className={`btn btn-sm ${filters.category === "" ? "btn-primary" : "btn-outline-primary"}`}
                >
                  All
                </button>
                {categories.slice(0, 10).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, category }))}
                    className={`btn btn-sm ${filters.category === category ? "btn-primary" : "btn-outline-primary"}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {appliedFilters.length > 0 && (
              <div className="mt-3 d-flex flex-wrap gap-2">
                {appliedFilters.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    className="btn btn-sm btn-dark"
                    onClick={() => onRemoveChip(chip.key)}
                    title="Remove filter"
                  >
                    {chip.label} <span className="ms-1">×</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        <div className="accordion mb-4" id="filtersAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="filtersHeading">
              <button
                type="button"
                className={`accordion-button${filtersOpen ? "" : " collapsed"}`}
                aria-expanded={filtersOpen ? "true" : "false"}
                onClick={() => setFiltersOpen((v) => !v)}
              >
                Filters <span className="ms-2 text-secondary">({appliedFilters.length})</span>
              </button>
            </h2>
            <div className={`accordion-collapse collapse${filtersOpen ? " show" : ""}`} aria-labelledby="filtersHeading">
              <div className="accordion-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Date from</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                      className="form-control"
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Date to</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      min={filters.dateFrom || undefined}
                      onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                      className="form-control"
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                      className="form-select"
                    >
                      <option value="">All</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Location</label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder={locations.length ? "e.g. Nairobi" : "Enter location"}
                      list="public-events-locations"
                      className="form-control"
                    />
                    {locations.length > 0 && (
                      <datalist id="public-events-locations">
                        {locations.map((loc) => (
                          <option key={loc} value={loc} />
                        ))}
                      </datalist>
                    )}
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Min price (Ksh)</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={filters.priceMin}
                      onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))}
                      placeholder="0"
                      className="form-control"
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Max price (Ksh)</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={filters.priceMax}
                      onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
                      placeholder="Any"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white border rounded-4 shadow-sm p-5 text-center">
            <h2 className="h4 fw-bold mb-2">No events found</h2>
            <p className="text-secondary mb-0">Try changing your search or filters.</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredEvents.map((event) => {
              const imageUrl = event.posterfile
                ? event.posterfile.startsWith("http")
                  ? event.posterfile
                  : mediaUrl(event.posterfile)
                : "https://via.placeholder.com/600x400?text=No+Poster+Available";

              return (
                <div className="col" key={event.id}>
                  <div
                    className="card h-100 shadow-sm border-0"
                    role="button"
                    onClick={() => {
                      if (!user) {
                        navigate("/signin");
                      } else {
                        navigate(`/dashboard/event/${event.id}`);
                      }
                    }}
                  >
                    <img src={imageUrl} alt={event.eventname || "Event Poster"} className="card-img-top" />
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between gap-2">
                        <h3 className="h5 fw-bold mb-1">{event.eventname}</h3>
                        {event.category ? <span className="badge text-bg-primary">{event.category}</span> : null}
                      </div>

                      <div className="text-secondary small">
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-primary">•</span>
                          <span className="text-truncate">{event.place}, {event.location}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span className="text-primary">•</span>
                          <span>{event.date ? new Date(event.date).toDateString() : "Date TBD"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-white border-top-0 pt-0 pb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="fw-bold text-primary">Ksh {event.ticketprice}</div>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!user) {
                              navigate("/signin");
                            } else if (user.role === "applicant") {
                              navigate(`/dashboard/payment/${event.id}`, { state: { event } });
                            } else {
                              showToast("Only applicants can book tickets.", "info");
                            }
                          }}
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    <Footer/>
   </div>
  );
};

export default PublicEvents;
