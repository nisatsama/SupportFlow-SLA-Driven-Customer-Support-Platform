const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS configuration for AI Studio preview and cross-origin access
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.json());

// API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const AuthRoutes = require("./routes/AuthRoutes");
const DashBoardRoutes = require("./routes/DashBoardRoutes");
const TicketRoutes = require("./routes/TicketRoutes");

app.use("/api/tickets", TicketRoutes);
app.use("/api/dashboard", DashBoardRoutes);
app.use("/api/auth", AuthRoutes);

// Error middleware for database fallback
app.use((err, req, res, next) => {
  if (
    err.name === "MongooseError" ||
    err.name === "MongoNetworkError" ||
    (err.message && err.message.includes("buffering timed out"))
  ) {
    console.warn("[AI Studio] Database offline — returning mock empty response");
    if (req.method === "GET") {
      return res.json(req.path.endsWith("s") || req.path.endsWith("s/") ? [] : {});
    }
    return res.status(503).json({ error: "Service temporarily unavailable (database offline)" });
  }
  next(err);
});

// Serve frontend build from client/dist
const distPath = path.resolve(__dirname, "../client/dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // In Express 5, catch-all route must be written as '*all'
  app.get("*all", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  // If dist does not exist yet
  app.get("*all", (req, res) => {
    res.send("Client frontend is building or dist not found. Please run 'npm run build'.");
  });
}

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
