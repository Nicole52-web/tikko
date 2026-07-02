import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/shared/loader/Loader";
// import { useToast } from "../context/ToastContext";
import {toast} from 'react-toastify';
import { apiUrl } from "../config/api";


const EventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  // const { showToast } = useToast();

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
        const res = await axios.get(apiUrl(`/api/v1/Event/my-event/${id}`), {
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
        toast.error("Failed to load event for editing.");
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

      toast.success("Event updated successfully!");
      navigate("/dashboard/events");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update event. Try again!");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 py-12 px-4">
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      <div
        className={`max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden transition-opacity duration-300 ${
          loading ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8">
          <h2 className="text-4xl font-bold text-white">Edit Event</h2>
          <p className="text-blue-50 mt-2 text-lg">Update your event information and details below.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information Section */}
          <div className="bg-gradient-to-br from-blue-50 to-transparent rounded-xl p-6 border border-blue-100">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-blue-600 rounded mr-3"></div>
              <h3 className="text-2xl font-bold text-slate-800">Basic Information</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Event Name *</label>
                <input
                  name="eventName"
                  type="text"
                  value={formData.eventName}
                  onChange={handleChange}
                  placeholder="Enter event name"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition hover:border-blue-300"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Location *</label>
                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Nairobi"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition hover:border-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Venue/Place *</label>
                  <input
                    name="place"
                    type="text"
                    value={formData.place}
                    onChange={handleChange}
                    placeholder="e.g., Sarit Expo Center"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition hover:border-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Date *</label>
                  <input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition hover:border-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Ticket Price (KES) *</label>
                  <input
                    name="ticketPrice"
                    type="text"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    placeholder="e.g., 1500"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition hover:border-blue-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Event Details Section */}
          <div className="bg-gradient-to-br from-blue-50 to-transparent rounded-xl p-6 border border-blue-100">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-blue-600 rounded mr-3"></div>
              <h3 className="text-2xl font-bold text-slate-800">Event Details</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Category *</label>
                <input
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Music, Sports, Tech"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition hover:border-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Additional Info</label>
                <input
                  name="other"
                  type="text"
                  value={formData.other}
                  onChange={handleChange}
                  placeholder="e.g., VIP access available"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition hover:border-blue-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Description *</label>
              <textarea
                name="description"
                rows="6"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a detailed description of your event..."
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none hover:border-blue-300"
              />
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="bg-gradient-to-br from-blue-50 to-transparent rounded-xl p-6 border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-1 h-8 bg-blue-600 rounded mr-3"></div>
              <h3 className="text-2xl font-bold text-slate-800">Event Poster</h3>
            </div>

            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition bg-gradient-to-br from-blue-50 to-white">
                <div className="text-center">
                  <svg className="mx-auto h-10 w-10 text-blue-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-14-8v12m0 0l-4-4m4 4l4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm font-semibold text-slate-700">Upload or drag your event poster</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB (Optional)</p>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                name="posterFile"
                className="hidden"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-4 border-2 border-slate-300 text-slate-700 font-semibold bg-white hover:bg-slate-100 hover:border-slate-400 transition duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-4 bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 shadow-md hover:shadow-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
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

