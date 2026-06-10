import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { apiUrl } from "../config/api";
import Loader from "../components/shared/loader/Loader";
import TicketCard from "../components/TicketCard";
import {
  canDownloadTicket,
  downloadTicketElement,
  formatEventDate,
} from "../utils/ticketHelpers";

const MyTickets = () => {
  const { token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(apiUrl("/api/v1/Ticket/my-tickets"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data.tickets || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTickets();
  }, [token]);

  const handleDownload = async () => {
    if (!ticketRef.current || !selectedTicket) return;
    setDownloading(true);
    try {
      const safeName = (selectedTicket.eventname || "ticket")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      await downloadTicketElement(
        ticketRef.current,
        `${safeName}-ticket-${selectedTicket.ticket_id}.png`
      );
    } catch (err) {
      console.error(err);
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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">My Tickets</h2>
        <p className="text-gray-500 mt-1">
          View and download your booked tickets. Downloads are available until the event day passes.
        </p>
      </div>

      {tickets.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 py-12 bg-white rounded-xl shadow">
          You have no tickets yet.{" "}
          <Link to="/dashboard/book-ticket" className="text-blue-600 hover:underline">
            Book a ticket
          </Link>{" "}
          to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {tickets.map((ticket) => {
              const canDownload = canDownloadTicket(ticket.date);
              const isSelected = selectedTicket?.ticket_id === ticket.ticket_id;

              return (
                <button
                  key={ticket.ticket_id}
                  type="button"
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full text-left p-5 bg-white rounded-3 shadow transition border-2 mb-2 ${
                    isSelected
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : "border-transparent hover:border-blue-200"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="">
                      <h3 className="font-semibold text-gray-800">{ticket.eventname}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {ticket.place}, {ticket.location} 
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {formatEventDate(ticket.date)}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 break-all">
                        Ticket {ticket.ticket_id}
                      </p>
                    </div>
                <span
  className={`inline-flex self-start text-xs font-medium px-2 py-0.5 rounded-full leading-none ${
    canDownload
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-gray-500"
  }`}
>
  {canDownload ? "Downloadable" : "Event passed"}
</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div>
            {selectedTicket ? (
              <div>
                <TicketCard ticket={selectedTicket} innerRef={ticketRef} />
                {canDownloadTicket(selectedTicket.date) ? (
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    {downloading ? "Preparing download..." : "Download Ticket"}
                  </button>
                ) : (
                  <p className="mt-4 text-center text-sm text-gray-500 bg-gray-50 py-3 rounded-lg">
                    Download is unavailable because this event has already passed.
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow text-gray-400">
                Select a ticket to preview and download
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
