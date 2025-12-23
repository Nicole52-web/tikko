import React, { useEffect, useState } from "react";
import HomeImage from "../assests/homeimg2.jpg";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/Event/all-events");
        const eventData = res.data.events || [];
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>

      {/* HERO SECTION */}
      <div className="relative w-full h-[85vh]">
        <img
          src={HomeImage}
          alt="Hero"
          className="w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 lg:px-0">
          <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm mb-5">
            Trusted by Event Organizers
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Discover Events. Book Tickets. <br />
            Live the Experience.
          </h1>

          <p className="text-gray-200 text-lg md:text-xl mt-4 max-w-2xl">
            Find exciting events near you. Book instantly and enjoy unforgettable moments.
          </p>

          <div className="flex space-x-4 mt-8">
            <button
              onClick={() => navigate("/events")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg font-semibold transition"
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
        </div>

        {/* SEARCH BAR */}
        <div className="flex justify-center mb-10">
          <form className="flex w-full sm:w-auto">
            <input
              type="search"
              placeholder="Search for an event..."
              className="w-72 md:w-96 px-4 py-2 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-xl transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* EVENT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
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
                      alert("Booking feature coming soon!");
                    }}
                  >
                    🎟️ Book Ticket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
