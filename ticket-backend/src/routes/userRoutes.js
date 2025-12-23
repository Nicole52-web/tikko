const express = require("express");
const { addUser, loginUser, getMe, updateUser } = require("../controllers/UserController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();



router.post("/createuser", addUser);
router.post("/login", loginUser);
router.get("/me", auth, getMe);
router.put("/update", auth, updateUser);

module.exports = router;