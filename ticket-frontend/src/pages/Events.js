import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Loader from "../components/shared/loader/Loader";


const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const confirmed = window.confirm("Delete this event? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/v1/Event/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
      showToast("Failed to delete event. Please try again.", "error");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
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
        showToast("Failed to load events.", "error");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchEvents();
  }, [token, showToast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
  <div className="p-6">
    {events.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          No event records available
        </h2>
        <p className="text-gray-500 mt-2">
          You haven’t created any events yet.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <h3 className="text-xl font-semibold text-gray-800">
                  {event.eventname}
                </h3>

                <p className="text-gray-500">
                  {event.place}, {event.location}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  {new Date(event.date).toDateString()}
                </p>

                <p className="text-blue-600 font-medium mt-2">
                  Ksh {event.ticketprice}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/event/${event.id}/edit`);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                    onClick={(e) => handleDelete(e, event.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
  );
};

export default Events;
