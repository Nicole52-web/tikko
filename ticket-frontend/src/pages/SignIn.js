import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Loader from "../components/shared/loader/Loader";
// import { useToast } from "../context/ToastContext";
import AuthBackgroundCarousel from "../components/AuthBackgroundCarousel";
import Footer from "../components/Footer";
import { toast } from 'react-toastify';
import { apiUrl } from "../config/api";


const SignIn = () => {
  const { login } = useContext(AuthContext);
  // const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(apiUrl("/api/v1/User/login"), {
        email,
        password,
      });
      login(res.data.token, res.data.user);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div>
 <div className="relative flex justify-center items-center min-h-screen overflow-hidden pt-24 pb-12 px-4">
      <AuthBackgroundCarousel />
      {/* Overlay loader */}
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
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-50 bg-blue-600 text-white font-semibold py-2 rounded-4 hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
    <Footer/>
   </div>
  );
};

export default SignIn;
