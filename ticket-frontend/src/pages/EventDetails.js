import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/shared/loader/Loader";
import {AuthContext} from "../context/AuthContext";



const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/Event/my-event/${id}`, 
          {
            headers:{
              Authorization: `Bearer ${token}`
            }
          }
        );
        const eventData = res.data.event ? res.data.event : res.data;

        if (!eventData) {
          setError("Event not found");
        } else {
          setEvent(eventData);
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
  if (!event) return <p className="text-center mt-6">No event data available.</p>;

  // Safe image URL
  const imageUrl = event?.posterfile
    ? event.posterfile.startsWith("http")
      ? event.posterfile
      : `http://localhost:5000${event.posterfile}`
    : "https://via.placeholder.com/600x400?text=No+Poster+Available";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Event Image */}
        <img
          src={imageUrl}
          alt={event?.eventname || "Event Poster"}
          className="w-full h-80 object-cover"
        />

        {/* Event Details */}
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {event?.eventname || "Untitled Event"}
          </h1>

          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Location:</span>{" "}
            {event?.place || "N/A"}, {event?.location || "N/A"}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Date:</span>{" "}
            {event?.date ? new Date(event.date).toLocaleDateString() : "N/A"}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Category:</span>{" "}
            {event?.category || "N/A"}
          </p>

          <p className="text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-800">Description:</span>{" "}
            {event?.description || "No description provided."}
          </p>

          <p className="text-blue-600 text-lg font-semibold">
            Ticket Price: {event?.ticketprice ?? "N/A"}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={() => alert("Booking feature coming soon!")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              🎟️ Book Ticket
            </button>
            <button
              onClick={() => navigate(-1)}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg transition-all duration-200"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
