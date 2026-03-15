const path = require("path");
const fs = require("fs");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../models/EventModel");
const pool = require("../db");

// Create Event
const handleCreateEvent = async (req, res) => {
  try {
    const {
      eventName,
      location,
      place,
      date,
      ticketPrice,
      category,
      other,
      description,
    } = req.body;


    const userId = req.user.id;

    const posterFile = req.file ? `/uploads/${req.file.filename}` : null;

    if (!posterFile) {
      return res.status(400).json({ message: "Poster image is required" });
    }

    const event = await createEvent({
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
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error creating event" });
  }
};

// Get all events creates by user
const handleGetEvents = async (req, res) => {
  try {
    const userId = req.user.id;


    const result = await pool.query(
      "SELECT * FROM events WHERE user_id = $1 ORDER BY date DESC",
 [userId]
    )
    
    res.json({events: result.rows});
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
};

const handleGetAllEvents = async (req, res) => {
  try {
    
    const events = await getAllEvents();
    res.json({events});
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
};

// Get single event
const handleGetEventById = async (req, res) => {
  try {
    const event = await getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event" });
  }
};

// Update Event
const handleUpdateEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await getEventById(id);
    if (!existing) return res.status(404).json({ message: "Event not found" });

    const posterFile = req.file ? `/uploads/${req.file.filename}` : existing.posterfile;

    const updated = await updateEvent(id, {
      eventName: req.body.eventName ?? existing.eventname,
      location: req.body.location ?? existing.location,
      place: req.body.place ?? existing.place,
      date: req.body.date ?? existing.date,
      ticketPrice: req.body.ticketPrice ?? existing.ticketprice,
      category: req.body.category ?? existing.category,
      other: req.body.other ?? existing.other,
      description: req.body.description ?? existing.description,
      posterFile,
    });

    res.json({ message: "Event updated successfully", event: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating event" });
  }
};


// Delete event
const handleDeleteEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const event = await getEventById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.posterfile) {
      const filePath = path.join(process.cwd(), "uploads", path.basename(event.posterfile));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await deleteEvent(id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event" });
  }
};

module.exports = {
  handleCreateEvent,
  handleGetEvents,
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent,
};
