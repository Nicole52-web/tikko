import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/shared/loader/Loader";
// import { useToast } from "../context/ToastContext";
import { apiUrl, mediaUrl } from "../config/api";
import {toast} from 'react-toastify';

const BookTicket = () => {
  const { token, user } = useContext(AuthContext);
  // const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  }, [toast]);

  const handleGoToPayment = (event) => {
    if (!user || user.role !== "applicant") {
      toast.info("Only applicants can book tickets.");
      return;
    }

    navigate(`/dashboard/payment/${event.id}`, { state: { event } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="text-left mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Book Tickets
        </h2>
        <p className="text-gray-500 mt-1">
          Browse the same events from the homepage and book your tickets here.
        </p>
      </div>

      {events.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No events are currently available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const imageUrl = event.posterfile
              ? event.posterfile.startsWith("http")
                ? event.posterfile
                : mediaUrl(event.posterfile)
              : "https://via.placeholder.com/600x400?text=No+Poster+Available";

            return (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden"
              >
                <img
                  src={imageUrl}
                  alt={event.eventname || "Event Poster"}
                  className="event-card-img"
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
                    className="mt-4 w-full btn btn-secondary py-2 transition disabled:opacity-60"
                    onClick={() => handleGoToPayment(event)}
                  >
                    Book Ticket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookTicket;

