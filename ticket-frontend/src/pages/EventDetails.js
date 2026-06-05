import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/shared/loader/Loader";
import { AuthContext } from "../context/AuthContext";
// import { useToast } from "../context/ToastContext";
import { apiUrl, mediaUrl } from "../config/api";
import {toast} from 'react-toastify';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  // const { showToast } = useToast();

  const isApplicant = user?.role === "applicant";
  const isOrganizer = user?.role === "organizer" || user?.role === "admin";
  const ownsEvent = isOrganizer && event?.user_id === user?.id;

  useEffect(() => {
    const fetchEvent = async () => {
      if (!token) {
        setError("Please sign in to view event details.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(apiUrl(`/api/v1/Event/${id}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const eventData = res.data.event ? res.data.event : res.data;

        if (!eventData) {
          setError("Event not found");
        } else {
          setEvent(eventData);
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event");
        toast.error("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, token, toast]);

  const handleGoToPayment = () => {
    if (!user || user.role !== "applicant") {
      toast.info("Only applicants can book tickets.");
      return;
    }
    navigate(`/dashboard/payment/${event.id}`, { state: { event } });
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
  if (!event) return <p className="text-center mt-6">No event data available.</p>;

  const imageUrl = event?.posterfile
    ? event.posterfile.startsWith("http")
      ? event.posterfile
      : mediaUrl(event.posterfile)
    : "https://via.placeholder.com/600x400?text=No+Poster+Available";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <img
          src={imageUrl}
          alt={event?.eventname || "Event Poster"}
          className="w-full h-80 object-cover"
        />

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

          {event?.other ? (
            <p className="text-gray-600">
              <span className="font-semibold text-gray-800">Other:</span> {event.other}
            </p>
          ) : null}

          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            <span className="font-semibold text-gray-800">Description:</span>{" "}
            {event?.description || "No description provided."}
          </p>

          <p className="text-blue-600 text-lg font-semibold">
            Ticket Price: Ksh {event?.ticketprice ?? "N/A"}
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            {isApplicant && (
              <button
                type="button"
                onClick={handleGoToPayment}
                className="bg-app-secondary hover:bg-app-secondary-dark text-white px-6 py-2 rounded-3 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Book Ticket
              </button>
            )}

            {ownsEvent && (
              <button
                type="button"
                onClick={() => navigate(`/dashboard/event/${event.id}/edit`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-3 transition-all duration-200"
              >
                Edit Event
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-3 transition-all duration-200"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
