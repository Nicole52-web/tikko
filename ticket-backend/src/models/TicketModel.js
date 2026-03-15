const pool = require("../db");

// Create a new ticket booking
const createTicket = async ({ userId, eventId, quantity = 1 }) => {
  const result = await pool.query(
    `INSERT INTO tickets (user_id, event_id, quantity)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, eventId, quantity]
  );
  return result.rows[0];
};

// Get all tickets for a specific user, including basic event info
const getTicketsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT 
        t.id as ticket_id,
        t.quantity,
        t.created_at,
        e.id as event_id,
        e.eventname,
        e.location,
        e.place,
        e.date,
        e.ticketprice,
        e.posterfile
     FROM tickets t
     JOIN events e ON t.event_id = e.id
     WHERE t.user_id = $1
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return result.rows;
};

module.exports = {
  createTicket,
  getTicketsByUser,
};

