import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/shared/loader/Loader";
import { useToast } from "../context/ToastContext";

const EventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    place: "",
    date: "",
    ticketPrice: "",
    category: "",
    other: "",
    description: "",
    posterFile: null,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/Event/my-event/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ev = res.data?.event ?? res.data;
        setFormData((prev) => ({
          ...prev,
          eventName: ev?.eventname ?? "",
          location: ev?.location ?? "",
          place: ev?.place ?? "",
          date: ev?.date ? String(ev.date).slice(0, 10) : "",
          ticketPrice: ev?.ticketprice ?? "",
          category: ev?.category ?? "",
          other: ev?.other ?? "",
          description: ev?.description ?? "",
        }));
      } catch (err) {
        console.error("Failed to load event:", err);
        showToast("Failed to load event for editing.", "error");
        navigate("/dashboard/events");
      } finally {
        setInitialLoading(false);
      }
    };

    if (token) fetchEvent();
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "posterFile" && !formData.posterFile) return; // keep existing poster if not re-uploaded
        data.append(key, formData[key]);
      });

      await axios.put(`http://localhost:5000/api/v1/Event/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      showToast("Event updated successfully!", "success");
      navigate("/dashboard/events");
    } catch (error) {
      console.error(error);
      showToast("Failed to update event. Try again!", "error");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 relative">
      {/* Overlay loader */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10">
          <Loader />
        </div>
      )}

      <div className={`w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-8 border border-blue-100 ${
        loading ? "opacity-60 pointer-events-none" : "opacity-100"
      }`}>
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">Edit Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex flex-col text-sm font-medium text-gray-700">
            Event Name
            <input
              name="eventName"
              type="text"
              value={formData.eventName}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col text-sm font-medium text-gray-700">
              Location
              <input
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                required
                className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-gray-700">
              Place
              <input
                name="place"
                type="text"
                value={formData.place}
                onChange={handleChange}
                required
                className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-gray-700">
              Date
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-gray-700">
              Ticket Price
              <input
                name="ticketPrice"
                type="text"
                value={formData.ticketPrice}
                onChange={handleChange}
                required
                className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </label>
          </div>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Category
            <input
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Other
            <input
              name="other"
              type="text"
              value={formData.other}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Description
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Replace Poster (optional)
            <input
              name="posterFile"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 rounded-lg text-white ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } transition`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEdit;

