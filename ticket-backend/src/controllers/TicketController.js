const {
  createTicket,
  getTicketsByUser,
  getTicketById,
} = require("../models/TicketModel");
const { getEventById } = require("../models/EventModel");
const { isValidUuid } = require("../utils/uuid");

// POST /api/v1/Ticket/book
const bookTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId, quantity = 1 } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "eventId is required" });
    }

    if (!isValidUuid(eventId)) {
      return res.status(400).json({ message: "Invalid eventId" });
    }

    const event = await getEventById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const ticket = await createTicket({ userId, eventId, quantity });

    res
      .status(201)
      .json({ message: "Ticket booked successfully", ticket, event });
  } catch (error) {
    console.error("Error booking ticket:", error);
    res.status(500).json({ message: "Server error booking ticket" });
  }
};

// GET /api/v1/Ticket/my-tickets
const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const tickets = await getTicketsByUser(userId);
    res.json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error fetching tickets" });
  }
};

// GET /api/v1/Ticket/my-tickets/:ticketId
const getMyTicketById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ticketId } = req.params;

    const ticket = await getTicketById(ticketId, userId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Server error fetching ticket" });
  }
};


const getOrganizerTickets = async (req,res) => {
  try {
    const organizerId = req.user.id;

    const ticket = await getTicketsByOrganizer(organizerId);

    res.json({ ticket});

  }catch (error)
 {
  console.log("EError fetching organizer tickets:", error);
  res.status(500).json({ message: "Server error fetching organizer tickets" });
 }
};

module.exports = {
  bookTicket,
  getMyTickets,
  getMyTicketById,
  getOrganizerTickets,
};

