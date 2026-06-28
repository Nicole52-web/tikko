import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
// import { useToast } from "../context/ToastContext";
import { apiUrl } from "../config/api";
import {toast} from 'react-toastify';

const Payment = () => {
  const { user, token } = useContext(AuthContext);
  // const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const event = location.state?.event || null;

  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [cardType, setCardType] = useState("visa");
  const [processing, setProcessing] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState("");

  if (!user) {
    navigate("/signin");
    return null;
  }

  if (user.role !== "applicant") {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Access denied</h2>
        <p className="text-gray-600">
          Only applicants can proceed to ticket payment.
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Event details not available
        </h2>
        <p className="text-gray-600 mb-4">
          Please go back to the Book Ticket page and try again.
        </p>
        <button
          className="px-4 py-2 bg-app-secondary hover:bg-app-secondary-dark text-white rounded-lg"
          onClick={() => navigate("/dashboard/book-ticket")}
        >
          Back to Book Ticket
        </button>
      </div>
    );
  }

  const pollPaymentStatus = async (checkoutRequestId) => {
    const maxAttempts = 30;
    const delayMs = 2000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const statusRes = await axios.get(
        apiUrl(`/api/v1/payments/status/${checkoutRequestId}`),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { status, ticket } = statusRes.data;

      if (status === "SUCCESS" && ticket?.ticket_id) {
        return ticket.ticket_id;
      }

      if (status === "FAILED") {
        throw new Error("Payment was declined or cancelled.");
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new Error(
      "Payment confirmation is taking longer than expected. Check My Tickets once M-PESA completes."
    );
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const amount = Number(event.ticketprice);

      if (!amount || Number.isNaN(amount) || amount <= 0) {
        toast.error("Invalid ticket amount. Please contact the event organizer.");
        setProcessing(false);
        return;
      }

      const pushRes = await axios.post(
        apiUrl("/api/v1/payments/stkpush"),
        {
          phoneNumber: mpesaPhone,
          amount,
          eventId: event.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const checkoutRequestId =
        pushRes.data?.data?.CheckoutRequestID ||
        pushRes.data?.checkoutRequestId;

      if (!checkoutRequestId) {
        throw new Error("Could not start payment. Please try again.");
      }

      toast.info("Complete the M-PESA prompt on your phone...");

      const ticketId = await pollPaymentStatus(checkoutRequestId);

      toast.success("Payment successful! Your ticket is ready.");
      navigate(`/dashboard/payment/success/${ticketId}`);
    } catch (error) {
      console.error("Error processing payment/booking:", error);
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error.message ||
        "Failed to process payment. Please try again.";
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        Ticket Payment
      </h1>

      {/* User Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          Personal Details
        </h2>
        <p className="text-gray-700">
          <span className="font-medium">First Name:</span> {user.firstname}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Last Name:</span> {user.lastname}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Email:</span> {user.email}
        </p>
      </div>

      {/* Event Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Event Summary
        </h2>
        <p className="text-gray-800 font-medium">{event.eventname}</p>
        <p className="text-gray-600">
          {event.place}, {event.location}
        </p>
        <p className="text-gray-500 text-sm">
          {new Date(event.date).toDateString()}
        </p>
        <p className="text-blue-600 font-semibold mt-2">
          Amount: Ksh {event.ticketprice}
        </p>
      </div>

      {/* Payment Form */}
      <form onSubmit={handlePay} className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Payment Method</h2>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="mpesa"
              checked={paymentMethod === "mpesa"}
              onChange={() => setPaymentMethod("mpesa")}
            />
            <span>M-PESA</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            <span>Bank Card (Visa / Mastercard)</span>
          </label>
        </div>

        {paymentMethod === "mpesa" && (
          <div className="space-y-3 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              M-PESA Phone Number
              <input
                type="tel"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                required
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 07xxxxxxxx"
              />
            </label>
          </div>
        )}

        {paymentMethod === "card" && (
          <div className="space-y-3 mt-2">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cardType"
                  value="visa"
                  checked={cardType === "visa"}
                  onChange={() => setCardType("visa")}
                />
                <span>Visa</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cardType"
                  value="mastercard"
                  checked={cardType === "mastercard"}
                  onChange={() => setCardType("mastercard")}
                />
                <span>Mastercard</span>
              </label>
            </div>

            <label className="block text-sm font-medium text-gray-700">
              Card Number
              <input
                type="text"
                required
                maxLength={19}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="xxxx xxxx xxxx xxxx"
              />
            </label>

            <div className="flex gap-4">
              <label className="block text-sm font-medium text-gray-700 flex-1">
                Expiry Date
                <input
                  type="text"
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MM/YY"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700 w-24">
                CVV
                <input
                  type="password"
                  required
                  maxLength={4}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="***"
                />
              </label>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-2 bg-app-secondary hover:bg-app-secondary-dark text-white rounded-3 disabled:opacity-60"
          >
            {processing ? "Waiting for M-PESA..." : "Pay & Book Ticket"}
          </button>
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-3 text-gray-700 hover:bg-gray-50"
            onClick={() => navigate("/dashboard/book-ticket")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;

