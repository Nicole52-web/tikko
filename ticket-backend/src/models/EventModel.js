const pool = require("../db");

// Create Event
const createEvent = async ({
  eventName,
  location,
  place,
  date,
  ticketPrice,
  category,
  other,
  description,
  posterFile,
  userId,
}) => {
  const result = await pool.query(
    `INSERT INTO events 
(eventname, location, place, date, ticketprice, category, other, description, posterfile, user_id)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [eventName, location, place, date, ticketPrice, category, other, description, posterFile,userId]
  );
  return result.rows[0];
};

// Get all events
const getAllEvents = async () => {
  const result = await pool.query("SELECT * FROM events ORDER BY date DESC");
  return result.rows;
};

// Get single event by ID
const getEventById = async (id) => {
  const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
  return result.rows[0];
};

// Update Event
const updateEvent = async (id, fields) => {
  const {
    eventName,
    location,
    place,
    date,
    ticketPrice,
    category,
    other,
    description,
    posterFile,
  } = fields;

  const result = await pool.query(
    `UPDATE events
     SET eventname = $1, location = $2, place = $3, date = $4,
         ticketprice = $5, category = $6, other = $7, description = $8, posterfile = $9
     WHERE id = $10
     RETURNING *`,
    [eventName, location, place, date, ticketPrice, category, other, description, posterFile, id]
  );
  return result.rows[0];
};

// Delete Event
const deleteEvent = async (id) => {
  await pool.query("DELETE FROM events WHERE id = $1", [id]);
};

module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };
