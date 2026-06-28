import React, { useEffect, useState } from "react";
import { generateQrDataUrl, formatEventDate } from "../utils/ticketHelpers";

const TicketCard = ({ ticket, innerRef }) => {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    generateQrDataUrl(ticket).then((url) => {
      if (!cancelled) setQrUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [ticket]);

  return (
    <div
      ref={innerRef}
      className="w-full max-w-md mx-auto bg-white border-2 border-blue-200 rounded-2xl overflow-hidden shadow-lg"
    >
      <div className="bg-blue-600 text-white px-6 py-4 text-center">
        <p className="text-sm uppercase tracking-wider opacity-90">Event Ticket</p>
        <h2 className="text-xl font-bold mt-1">{ticket.eventname}</h2>
      </div>

      <div className="p-6 space-y-4">
        <div className="text-center text-gray-600 text-sm">
          <p className="font-medium text-gray-800">
            {ticket.firstname} {ticket.lastname}
          </p>
          <p>{ticket.email}</p>
        </div>

        <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-gray-900">Venue:</span>{" "}
            {ticket.place}, {ticket.location}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Date:</span>{" "}
            {formatEventDate(ticket.date)}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Quantity:</span>{" "}
            {ticket.quantity}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Price:</span> Ksh{" "}
            {ticket.ticketprice}
          </p>
          <p className="text-xs break-all">
            <span className="font-semibold text-gray-900">Ticket ID:</span>{" "}
            {ticket.ticket_id}
          </p>
        </div>

        {qrUrl && (
          <div className="flex flex-col items-center pt-2">
            <img
              src={qrUrl}
              alt="Ticket QR code"
              className="w-40 h-40 rounded-lg border border-gray-100"
            />
            <p className="text-xs text-gray-500 mt-2">Scan at venue entry</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
