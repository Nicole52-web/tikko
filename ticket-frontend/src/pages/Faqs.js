import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "What is this platform about?",
    answer:
      "This platform helps you manage your projects efficiently with tools for tracking, collaboration, and reporting.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Click on 'Forgot Password' at the login screen and follow the instructions sent to your email.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use industry-standard encryption and security best practices to keep your data safe.",
  },
  {
    question: "Can I use it for free?",
    answer:
      "We offer a free tier with limited features. You can upgrade anytime for more advanced functionality.",
  },
  {
    question: "How do I post my event",
    answer:
      "Go to the Sign up page, Make sure you check the sign up as an Event Organizer Checkbox while registering",
  },
];

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-8 text-center">
        Frequently Asked Questions
      </h1>

      <div className="w-full max-w-3xl space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium text-blue-700 hover:bg-blue-100 focus:outline-none"
            >
              <span>{faq.question}</span>
              <FaChevronDown
                className={`transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-180 text-blue-500" : ""
                }`}
              />
            </button>

            <div
              className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? "max-h-40 py-3" : "max-h-0"
              }`}
            >
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;
