import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoLogoInstagram } from "react-icons/io5";
import { FaTiktok, FaXTwitter, FaFacebookF } from "react-icons/fa6";

const Footer = () => {
  return (
    <>
      {/* Main Footer */}
      <footer className="bg-blue-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Left Section */}
          <div>
            <h2 className="text-2xl font-bold mb-3">Tikko</h2>
            <p className="flex items-center gap-2 mb-2">
              <FaPhoneAlt className="text-blue-200" /> +254798705799
            </p>
            <p className="flex items-center gap-2 mb-2">
              <FaPhoneAlt className="text-blue-200" /> +254725151626
            </p>
            <p className="flex items-center gap-2">
              <MdOutlineEmail className="text-blue-200" /> booktikko@gmail.com
            </p>
          </div>

          {/* Middle Section */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-200 transition duration-200"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-200 transition duration-200"
                >
                  Sign In
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-200 transition duration-200"
                >
                  Create Account
                </a>
              </li>
            </ul>
          </div>

          {/* Right Section */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Support</h3>
            <ul className="space-y-2 mb-4">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-200 transition duration-200"
                >
                  Help
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-200 transition duration-200"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-200 transition duration-200"
                >
                  Contact Us
                </a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex space-x-5 text-2xl">
              <a
                href="#"
                className="hover:text-blue-300 transition transform hover:scale-110"
              >
                <IoLogoInstagram />
              </a>
              <a
                href="#"
                className="hover:text-blue-300 transition transform hover:scale-110"
              >
                <FaTiktok />
              </a>
              <a
                href="#"
                className="hover:text-blue-300 transition transform hover:scale-110"
              >
                <FaXTwitter />
              </a>
              <a
                href="#"
                className="hover:text-blue-300 transition transform hover:scale-110"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Bar */}
      <div className="bg-blue-900 text-center text-white py-3 text-sm">
        <span className="font-semibold">Tikko</span> © 2025 All rights reserved
      </div>
    </>
  );
};

export default Footer;
