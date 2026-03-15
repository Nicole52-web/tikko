import React, { useContext, useEffect, useMemo, useState } from "react";
import HomeImage from "../assests/homeimg2.jpg";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import Loader from "./shared/loader/Loader";
import { AuthContext } from "../context/AuthContext";

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
  const { showToast } = useToast();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/v1/Event/all-events");
        const eventData = res.data.events || [];
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

  return (
    <>

      {/* HERO SECTION */}
      <div className="relative w-full h-[85vh] pt-20">


        <img
          src={HomeImage}
          alt="Hero"
          className="w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 text-center px-4 lg:px-0">
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
            Trusted by Event Organizers
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Discover Events. Book Tickets. <br />
            Live the Experience.
          </h1>

          <p className="text-white text-lg md:text-xl max-w-2xl">
            Find exciting events near you. Book instantly and enjoy unforgettable moments.
          </p>

          <div className="flex space-x-4">
           <button
  onClick={() => navigate("/events")}
  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold transition"
>
  Start Exploring →
</button>

            <button
              className="border border-white text-white px-6 py-3 rounded-xl text-lg hover:bg-white hover:text-blue-600 transition"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* UPCOMING EVENTS */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Upcoming Events
          </h2>
          <p className="text-gray-500 text-lg mt-2">
            Book Your Tickets Now
          </p>
          {/* Decorative line under subtitle */}
          <div className="mt-4 h-1 w-24 bg-blue-600 mx-auto rounded-full" />
        </div>

        {/* SEARCH BAR */}
        <div className="flex justify-center mb-16">
          <form className="w-full max-w-4xl" onSubmit={onSubmitSearch}>
            <div className="flex w-full justify-center">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for an event..."
                className="w-full sm:w-[28rem] md:w-[36rem] px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg transition"
              >
                Search
              </button>
            </div>

            <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date from</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date to</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    min={filters.dateFrom || undefined}
                    onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder={locations.length ? "e.g. Nairobi" : "Enter location"}
                    list="home-locations"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {locations.length > 0 && (
                    <datalist id="home-locations">
                      {locations.map((loc) => (
                        <option key={loc} value={loc} />
                      ))}
                    </datalist>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min price (Ksh)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={filters.priceMin}
                    onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max price (Ksh)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={filters.priceMax}
                    onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
                    placeholder="Any"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Clear filters
                  </button>
                </div>

                <div className="flex items-end justify-center sm:justify-end">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-700">{filteredEvents.length}</span> of{" "}
                    <span className="font-medium text-gray-700">{events.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* EVENT CARDS */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 mb-16">
            {filteredEvents.map((event) => {
            const imageUrl = event.posterfile
              ? event.posterfile.startsWith("http")
                ? event.posterfile
                : `http://localhost:5000${event.posterfile}`
              : "https://via.placeholder.com/600x400?text=No+Poster+Available";

            return (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden cursor-pointer"
                onClick={() => navigate(`/dashboard/event/${event.id}`)}
              >
                <img
                  src={imageUrl}
                  alt={event.eventname || "Event Poster"}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {event.eventname}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    {event.place}, {event.location}
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(event.date).toDateString()}
                  </p>

                  <p className="text-blue-600 font-semibold text-lg mt-3">
                    Ksh {event.ticketprice}
                  </p>

                  <button
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        navigate("/signin");
                      } else if (user.role === "applicant") {
                        navigate(`/dashboard/payment/${event.id}`, {
                          state: { event },
                        });
                      } else {
                        showToast("Only applicants can book tickets.", "info");
                      }
                    }}
                  >
                    🎟️ Book Ticket
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Home;
