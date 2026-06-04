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
        e.posterfile,
        u.firstname,
        u.lastname,
        u.email
     FROM tickets t
     JOIN events e ON t.event_id = e.id
     JOIN users u ON t.user_id = u.id
     WHERE t.user_id = $1
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return result.rows;
};

const getTicketById = async (ticketId, userId) => {
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
        e.posterfile,
        u.firstname,
        u.lastname,
        u.email
     FROM tickets t
     JOIN events e ON t.event_id = e.id
     JOIN users u ON t.user_id = u.id
     WHERE t.id = $1 AND t.user_id = $2`,
    [ticketId, userId]
  );
  return result.rows[0];
};

const getLatestTicketForEvent = async (userId, eventId) => {
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
        e.posterfile,
        u.firstname,
        u.lastname,
        u.email
     FROM tickets t
     JOIN events e ON t.event_id = e.id
     JOIN users u ON t.user_id = u.id
     WHERE t.user_id = $1 AND t.event_id = $2
     ORDER BY t.created_at DESC
     LIMIT 1`,
    [userId, eventId]
  );
  return result.rows[0];
};

module.exports = {
  createTicket,
  getTicketsByUser,
  getTicketById,
  getLatestTicketForEvent,
};

