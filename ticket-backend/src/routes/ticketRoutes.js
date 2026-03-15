const express = require("express");
const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { bookTicket, getMyTickets } = require("../controllers/TicketController");

const router = express.Router();

// Applicants can book tickets and view their own tickets
router.post("/book", auth, authorizeRoles("applicant"), bookTicket);
router.get("/my-tickets", auth, authorizeRoles("applicant"), getMyTickets);

module.exports = router;

