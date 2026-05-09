import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/shared/loader/Loader";
import { useToast } from "../context/ToastContext";
import AuthBackgroundCarousel from "../components/AuthBackgroundCarousel";
import Footer from "../components/Footer";

const SignUp = () => {
  const { showToast } = useToast();
  const [role, setRole] = useState("applicant");
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/User/createuser",
        {
          firstname: firstName,
          lastname: lastName,
          email,
          password,
          role,
        }
      );

      if (response.status === 200) {
        showToast("Account created successfully. Please sign in.", "success");
        navigate("/signin");
      } else {
        throw new Error("Unexpected Error");
      }
    } catch (error) {
      showToast("Failed to create account. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div>
 <div className="relative flex justify-center items-center min-h-screen overflow-hidden pb-12 px-4" style={{ paddingTop: 120, paddingBottom: 120 }}>
      <AuthBackgroundCarousel />
      {/* Overlay Loader */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-30">
          <Loader />
        </div>
      )}

      <div
        className={`relative z-20 bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center transition-all duration-300 ${
          loading ? "opacity-60 pointer-events-none" : "opacity-100"
        }`}
      >
        <h1 className="text-4xl font-bold text-blue-700 mb-2 tracking-wide">
          Tikko
        </h1>
        <h2 className="text-lg text-gray-600 mb-6 font-medium">
          Create Your Account
        </h2>

        <form method="POST" onSubmit={handleSubmit} className="space-y-4">
          <input
            id="firstName"
            name="firstName"
            placeholder="First Name"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <input
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <input
            id="email"
            name="email"
            placeholder="Email address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <input
            id="password"
            name="password"
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <div className="flex items-center gap-2 justify-start">
            <input
            type="checkbox"
            id="organizer"
            checked={ role === "organizer"}
            onChange={(e) => 
              setRole(e.target.checked ? "organizer" : "applicant")
            }
            disabled={loading}
            className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="organizer" className="text-gray-700 text-sm cursor-pointer">
              Sign up as an <span className="font-semibold">Event Organizer</span>
            </label>

             
  
          </div>

          <button
            type="submit"
            className="w-50 bg-blue-600 text-white font-semibold py-2 rounded-4 hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
    <Footer/>
   </div>

  
  );
};

export default SignUp;
