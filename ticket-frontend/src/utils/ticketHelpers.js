import html2canvas from "html2canvas";
import QRCode from "qrcode";

/** True when the event calendar day is today or in the future. */
export function canDownloadTicket(eventDateStr) {
  const eventDay = new Date(eventDateStr);
  eventDay.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today <= eventDay;
}

export function buildQrPayload(ticket) {
  return JSON.stringify({
    ticketId: ticket.ticket_id,
    eventId: ticket.event_id,
    eventName: ticket.eventname,
    date: ticket.date,
  });
}

export async function generateQrDataUrl(ticket) {
  return QRCode.toDataURL(buildQrPayload(ticket), {
    width: 200,
    margin: 2,
    errorCorrectionLevel: "M",
  });
}

export async function downloadTicketElement(element, filename) {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export function formatEventDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
