const express = require("express");
const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
  bookTicket,
  getMyTickets,
  getMyTicketById,
  getOrganizerTickets,
} = require("../controllers/TicketController");
const validateUuidParams = require("../middleware/validateUuidParams");

const router = express.Router();

// Applicants can book tickets and view their own tickets
router.post("/book", auth, authorizeRoles("applicant"), bookTicket);
router.get("/my-tickets", auth, authorizeRoles("applicant"), getMyTickets);
router.get(
  "/my-tickets/:ticketId",
  auth,
  authorizeRoles("applicant"),
  validateUuidParams("ticketId"),
  getMyTicketById
);
router.get("/booked-events", auth, authorizeRoles("organizer", "admin"), getOrganizerTickets);

module.exports = router;

