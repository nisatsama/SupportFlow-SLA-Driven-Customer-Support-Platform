const express = require("express");

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
