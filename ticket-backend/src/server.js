const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/v1/User", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/v1/Event", eventRoutes);
app.use("/api/v1/Ticket", ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
