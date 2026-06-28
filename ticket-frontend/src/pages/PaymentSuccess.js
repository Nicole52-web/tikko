import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { apiUrl } from "../config/api";
import TicketCard from "../components/TicketCard";
import Loader from "../components/shared/loader/Loader";
import {
  canDownloadTicket,
  downloadTicketElement,
} from "../utils/ticketHelpers";

const PaymentSuccess = () => {
  const { ticketId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(
          apiUrl(`/api/v1/Ticket/my-tickets/${ticketId}`),
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTicket(res.data.ticket);
      } catch (err) {
        console.error(err);
        setError("Could not load your ticket. Please try My Tickets from the sidebar.");
      } finally {
        setLoading(false);
      }
    };

    if (token && ticketId) {
      fetchTicket();
    }
  }, [token, ticketId]);

  const handleDownload = async () => {
    if (!ticketRef.current || !ticket) return;
    setDownloading(true);
    try {
      const safeName = (ticket.eventname || "ticket")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      await downloadTicketElement(
        ticketRef.current,
        `${safeName}-ticket-${ticket.ticket_id}.png`
      );
    } catch (err) {
      console.error(err);
      setError("Failed to download ticket. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow text-center">
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-tickets")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to My Tickets
        </button>
      </div>
    );
  }

  const downloadAllowed = canDownloadTicket(ticket.date);

  return (
    <div className="flex justify-center py-6 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
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
          <h1 className="text-2xl font-bold text-gray-900">Payment successful</h1>
          <p className="mt-2 text-gray-600">
            Your ticket is ready. Download it below or find it anytime under My Tickets.
          </p>
        </div>

        <TicketCard ticket={ticket} innerRef={ticketRef} />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {downloadAllowed ? (
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {downloading ? "Preparing download..." : "Download Ticket"}
            </button>
          ) : (
            <p className="text-center text-amber-700 bg-amber-50 px-4 py-3 rounded-lg">
              This event has passed. Ticket download is no longer available.
            </p>
          )}
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-tickets")}
            className="bg-white text-blue-600 px-6 py-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
          >
            My Tickets
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/book-ticket")}
            className="bg-white text-gray-700 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Book Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
