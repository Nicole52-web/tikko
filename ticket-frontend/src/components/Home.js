import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import HomeImage from "../assests/home2.png";
import Footer from "./Footer";
import Loader from "./shared/loader/Loader";
import { AuthContext } from "../context/AuthContext";
import { apiUrl, mediaUrl } from "../config/api";
import { toast } from "react-toastify";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    category: "",
    location: "",
    priceMin: "",
    priceMax: "",
  });

  const navigate = useNavigate();
 
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
        toast.error("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  },[]);

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

    return events.filter((event) => {
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
  }, [events, filters, searchTerm]);

  const onSubmitSearch = (e) => {
    e.preventDefault();
  };

  const onClearFilters = () => {
    setSearchTerm("");
    setFilters({
      dateFrom: "",
      dateTo: "",
      category: "",
      location: "",
      priceMin: "",
      priceMax: "",
    });
  };

  // Make sure fade-in animations apply even when cards load after the API call.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate");
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".fade-in-up");
    elements.forEach((el) => {
      observer.observe(el);
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("animate");
    });

    return () => observer.disconnect();
  }, [loading, filteredEvents.length]);

  return (
    <>
      {/* HERO SECTION */}
      <div className="relative w-full h-[85vh] pt-20">
        <img src={HomeImage} alt="Hero" className="w-full h-full object-cover" />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 text-center px-4 lg:px-0 fade-in-up">
          <span className=" text-white px-4 py-1 rounded-full text-sm" style={{ backgroundColor: '#F3631B' }}>
            Trusted by Event Organizers
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Discover Events. Book Tickets. <br />
            Live the Experience.
          </h1>

          <p className="text-white text-lg md:text-xl max-w-2xl">
            Find exciting events near you. Book instantly and enjoy unforgettable moments.
          </p>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="text-white px-6 py-3 rounded-4 text-lg font-semibold transition" style={{backgroundColor: "#F3631B", hover: { backgroundColor: "#dd7846" } }}
            >
              Start Exploring →
            </button>

            <button
              type="button"
              className="border border-white text-white px-6 py-3 rounded-4 text-lg hover:bg-white hover:text-blue-600 transition"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* EVENTS SECTION */}
      <div className="bg-slate-100 py-5">
        <div className="container">
        <div className="text-center mb-4 fade-in-up">
          <h2 className="display-6 fw-bold mb-2">Upcoming Events</h2>
          <p className="text-secondary mb-0">Search and filter, then book in seconds.</p>
        </div>

        {/* FILTERS */}
        <div className="bg-white border rounded-4 shadow-sm p-4 fade-in-up">
          <form onSubmit={onSubmitSearch}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-6 col-lg-3">
                <label className="form-label fw-semibold">Search</label>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Event name, place, category..."
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
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
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
                  list="home-locations"
                  className="form-control"
                />
                {locations.length > 0 && (
                  <datalist id="home-locations">
                    {locations.map((loc) => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                )}
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <label className="form-label fw-semibold">From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                  className="form-control"
                />
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <label className="form-label fw-semibold">To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                  className="form-control"
                />
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

              <div className="col-12 col-lg-3">
                <button type="button" onClick={onClearFilters} className="btn btn-outline-secondary w-100">
                  Clear filters
                </button>
              </div>

              <div className="col-12 col-lg-3 text-lg-end">
                <div className="text-muted small">
                  Showing <span className="fw-semibold text-dark">{filteredEvents.length}</span> of{" "}
                  <span className="fw-semibold text-dark">{events.length}</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* EVENT CARDS (match /events page styling) */}
        <div className="mt-4">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <Loader />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-white border rounded-4 shadow-sm p-5 text-center fade-in-up">
              <h2 className="h4 fw-bold mb-2">No events found</h2>
              <p className="text-secondary mb-0">Try clearing filters or check back later.</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 fade-in-up">
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
                      <img src={imageUrl} alt={event.eventname || "Event Poster"} className="card-img-top event-card-img" />
                      <div className="card-body">
                        <div className="d-flex align-items-start justify-content-between gap-2">
                          <h3 className="h5 fw-bold mb-1">{event.eventname}</h3>
                          {event.category ? <span className="badge bg-blue-700">{event.category}</span> : null}
                        </div>

                        <div className="text-secondary small">
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-primary">•</span>
                            <span className="text-truncate">
                              {event.place}, {event.location}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2 mt-1">
                            <span className="text-primary">•</span>
                            <span>{event.date ? new Date(event.date).toDateString() : "Date TBD"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="card-footer bg-white border-top-0 pt-0 pb-3">
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <div className="fw-bold text-blue-300">Ksh {event.ticketprice}</div>
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
                                toast.info("Only applicants can book tickets.");
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
      </div>

      <Footer />
    </>
  );
};

export default Home;
