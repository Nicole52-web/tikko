const express = require("express");
const multer = require("multer");
const path = require("path");
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
router.post("/create-event",auth, upload.single("posterFile"), handleCreateEvent);
router.get("/my-events", auth,handleGetEvents);
router.get("/my-event/:id", auth, handleGetEventById);
router.put("/:id", upload.single("posterFile"), handleUpdateEvent);
router.delete("/:id", auth, handleDeleteEvent);
router.get("/all-events",handleGetAllEvents);

module.exports = router;
