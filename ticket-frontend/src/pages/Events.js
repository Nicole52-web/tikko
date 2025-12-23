import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../context/AuthContext";


const Events = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/Event/my-events",
          {
            headers:{
              Authorization:`Bearer ${token}`
            },
          }
        );
        const eventData = res.data.events; 
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    if (token) fetchEvents();
  }, [token]);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const imageUrl = event.posterfile
          ? event.posterfile.startsWith("http")
            ? event.posterfile
            : `http://localhost:5000${event.posterfile}`
          : "https://via.placeholder.com/600x400?text=No+Poster+Available";

        return (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
            onClick={() => navigate(`/dashboard/event/${event.id}`)}
          >
            <img
              src={imageUrl}
              alt={event.eventname || "Event Poster"}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{event.eventname}</h3>
              <p className="text-gray-500">
                {event.place}, {event.location}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(event.date).toDateString()}
              </p>
              <p className="text-blue-600 font-medium mt-2">
                Ksh {event.ticketprice}
              </p>
              <button
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
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
  );
};

export default Events;
