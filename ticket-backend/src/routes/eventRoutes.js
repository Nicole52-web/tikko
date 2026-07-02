const express = require("express");
const multer = require("multer");
// const path = require("path");
const authorizeRoles = require("../middleware/roleMiddleware");
const { CloudinaryStorage} = require("multer-storage-cloudinary");




const {
  handleCreateEvent,
  handleGetEvents,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent,
  handleGetAllEvents,
} = require("../controllers/EventController");
const auth = require("../middleware/authMiddleware");
const validateUuidParams = require("../middleware/validateUuidParams");

const router = express.Router();

// Multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
// });

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tikko-events",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// Routes — register static paths before "/:id" so they are not captured as IDs
router.get("/all-events", handleGetAllEvents);
router.post("/create-event",auth, authorizeRoles("organizer","admin"),upload.single("posterFile"), handleCreateEvent);
router.get("/my-events", auth,handleGetEvents);
router.get(
  "/my-event/:id",
  auth,
  authorizeRoles("organizer", "admin"),
  validateUuidParams("id"),
  handleGetEventById
);
// Any signed-in user (applicants browsing public events, etc.)
router.get("/:id", auth, validateUuidParams("id"), handleGetEventById);
router.put(
  "/:id",
  auth,
  validateUuidParams("id"),
  upload.single("posterFile"),
  handleUpdateEvent
);
router.delete("/:id", auth, validateUuidParams("id"), handleDeleteEvent);

module.exports = router;
