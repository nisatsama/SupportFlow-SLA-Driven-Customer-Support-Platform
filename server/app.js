const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

const AuthRoutes = require("./routes/AuthRoutes");
const DashBoardRoutes = require("./routes/DashBoardRoutes");
const TicketRoutes = require("./routes/TicketRoutes");

app.use("/api/tickets", TicketRoutes);
app.use("/api/dashboard", DashBoardRoutes);
app.use("/api/auth", AuthRoutes);

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to DB");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to DB", err);
    process.exit(1);
  });
