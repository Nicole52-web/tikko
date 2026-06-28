import React from "react";
import Footer from "../components/Footer";
import ContactImage from "../assests/contact.svg";


const Contact = () => {
    const loading = false;

    return(
        <div>
            

            <div
  className="min-h-screen grid grid-cols-1 md:grid-cols-2"
  style={{ paddingTop: "90px" }}
>
  {/* LEFT SIDE */}
  <div className=" flex items-center justify-center min-h-screen p-12 border-r border-gray-200">
    <img
      src={ContactImage}
      alt="Contact Illustration"
      className="w-full max-w-2xl object-contain"
    />
  </div>

  {/* RIGHT SIDE */}
  <div className="flex items-center justify-center min-h-screen bg-white px-12">
    <div
      className={`w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-10 transition-all duration-300 ${
        loading
          ? "opacity-60 pointer-events-none"
          : "opacity-100"
      }`}
    >
      <h1 className="text-4xl font-bold text-blue-800 text-center mb-3">
        Contact Us
      </h1>

      <p className="text-gray-600 mb-8 text-center">
        For inquiries, support, or feedback, please send us a message.
      </p>

      <form className="space-y-4 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Your First Name"
          disabled={loading}
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="text"
          placeholder="Your Last Name"
          disabled={loading}
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="email"
          placeholder="Your Email Address"
          disabled={loading}
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <textarea
          rows="5"
          placeholder="Your Message"
          disabled={loading}
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 mb-4 text-white py-3 rounded-4 hover:bg-blue-800 transition font-medium"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  </div>
</div>
            <Footer/>
        </div>
    )


}

export default Contact;