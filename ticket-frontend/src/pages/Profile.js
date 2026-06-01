import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useToast } from "../context/ToastContext";

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    firstName: user?.firstname || "",
    lastName: user?.lastname || "",
    email: user?.email || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(
        "http://localhost:5000/api/v1/User/update",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Profile updated successfully!", "success");
      setIsEditing(false);
    } catch (err) {
      console.error("Update error", err);
      showToast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        My Profile
      </h2>

      <div className="space-y-5">
        {/* First Name */}
        <div>
          <label className="block text-gray-600 font-medium mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
            }`}
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-gray-600 font-medium mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-600 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
            }`}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-4 mt-8">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-3 shadow-sm transition"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={loading}
              className={`bg-green-600 hover:bg-green-700 text-white px-5 py-2 mx-2 rounded-3 shadow-sm transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-3 shadow-sm transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
