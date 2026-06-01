import React, { useState } from 'react'
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import Loader from '../components/shared/loader/Loader';
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";



const EventPost = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
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

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const token = localStorage.getItem("token");


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      
    const res = await axios.post(
  "http://localhost:5000/api/v1/Event/create-event",
  data,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }
);

      showToast("Event created successfully!", "success");
      console.log(res.data);

      // Reset form
      setFormData({
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
      setStep(1);
      navigate("/dashboard/post-event/success");
    } catch (error) {
      console.error(error);
      showToast("Failed to create event. Try again!", "error");
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
          Create Your Event
        </h2>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <h3 className="text-lg font-semibold text-blue-500 mb-4">
                Step 1: Event Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="flex flex-col gap-1 text-base font-medium text-gray-700">
                  Event Name
                  <input
                    name="eventName"
                    placeholder="e.g. Color Fest"
                    type="text"
                    value={formData.eventName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  />
                </label>

                <label className="flex flex-col gap-1 text-base font-medium text-gray-700">
                  Location
                  <input
                    name="location"
                    placeholder="Westlands"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  />
                </label>

                <label className="flex flex-col gap-1 text-base font-medium text-gray-700">
                  Place
                  <input
                    name="place"
                    placeholder="Sarit Expo Center"
                    type="text"
                    value={formData.place}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  />
                </label>

                <label className="flex flex-col gap-1 text-base font-medium text-gray-700">
                  Date
                  <input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  />
                </label>
              </div>

              <div className="flex justify-end mt-6">
             <button
  type="button"
  onClick={nextStep}
  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition"
  style={{ borderRadius: "0.35rem" }}
>
  Next
  <FaArrowRight />
</button>
              </div>
            </div>
          )}


          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <h3 className="text-lg font-semibold text-blue-500 mb-4">
                Step 2: Additional Info
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="flex flex-col gap-1 text-base font-medium text-gray-700">
                  Ticket Price
                  <input
                    name="ticketPrice"
                    placeholder="Ksh 1500"
                    type="text"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  />
                </label>

                <label className="flex flex-col gap-1 text-base font-medium text-gray-700">
                  Category
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">-- Select Category --</option>
                    <option>Educational</option>
                    <option>Corporate & Professional</option>
                    <option>Social & Cultural</option>
                    <option>Entertainment</option>
                    <option>Sports & Fitness</option>
                    <option>Charity & Non-Profit</option>
                    <option>Government & Civic</option>
                    <option>Religious & Spiritual</option>
                    <option>Tech & Innovation</option>
                    <option>Academic & Student</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1 text-base font-medium text-gray-700 md:col-span-2">
                  Other
                  <input
                    name="other"
                    placeholder="If not in category list"
                    type="text"
                    value={formData.other}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  />
                </label>

                <label className="flex flex-col gap-1 text-base font-medium text-gray-700 md:col-span-2">
                  Description
                  <textarea
                    name="description"
                    placeholder="Describe what the event is about"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  ></textarea>
                </label>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 bg-gray-300 text-gray-700 px-6 py-2  hover:bg-gray-400 transition"
                  style={{ borderRadius: "0.35rem"}}
                >
                  <FaArrowLeft /> Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2  hover:bg-blue-700 transition" style={{ borderRadius: "0.35rem"}}
                >
                  Next <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <h3 className="text-lg font-semibold text-blue-500 mb-4">
                Step 3: Upload Poster & Submit
              </h3>

              <label className="flex flex-col gap-1 text-base font-medium text-gray-700">
                Event Poster
                <input
                  name="posterFile"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                />
              </label>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 bg-gray-300 text-gray-700 px-6 py-2 hover:bg-gray-400 transition" style={{ borderRadius: "0.35rem"}}
                >
                  <FaArrowLeft /> Back
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 text-white ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } transition `}
                   onClick={nextStep}
                  disabled={loading}
                  style={{ borderRadius: "0.35rem"}}
                >
                  {loading ? "Uploading..." : "Submit Event"}
                </button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="animate-fadeIn">
              <h3 className="text-lg font-semibold text-blue-500 mb-4">
                Event Created Successfully!
              </h3>
              <p className="text-gray-700 mb-6">
                Your event has been created and is now live on Tikko. You can view it in the events section.
              </p>

              
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default EventPost

