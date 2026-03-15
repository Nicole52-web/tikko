const express = require("express");
const multer = require("multer");
const path = require("path");
const authorizeRoles = require("../middleware/roleMiddleware");




const {
  handleCreateEvent,
  handleGetEvents,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent,
  handleGetAllEvents,
} = require("../controllers/EventController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.post("/create-event",auth, authorizeRoles("organizer","admin"),upload.single("posterFile"), handleCreateEvent);
router.get("/my-events", auth,handleGetEvents);
router.get("/my-event/:id", auth, authorizeRoles("organizer", "admin"),handleGetEventById);
router.put("/:id", auth, upload.single("posterFile"), handleUpdateEvent);
router.delete("/:id", auth, handleDeleteEvent);
router.get("/all-events",handleGetAllEvents);

module.exports = router;
