import React from "react";
import { useNavigate } from "react-router-dom";

const EventPostSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8 border border-blue-100 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600"
          >
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Event submitted successfully</h2>
        <p className="mt-2 text-gray-600">
          Your event has been received. You can post another event or go back to your dashboard events.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard/post-event")}
            className="bg-blue-600 text-white px-6 py-3  hover:bg-blue-700 transition" style={{ borderRadius: "0.35rem"}}
          >
            Post Another Event
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/events")}
            className="bg-white text-blue-600 px-6 py-3  border border-blue-200 hover:bg-blue-50 transition" style={{ borderRadius: "0.35rem"}}
          >
            View My Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPostSuccess;

