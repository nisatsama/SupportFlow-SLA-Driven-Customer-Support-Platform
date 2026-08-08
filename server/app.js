const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Whitelist your React app's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP requests
    credentials: true, // Allow cookies/headers if needed
  }),
);
app.use(express.json());
const AuthRoutes = require("./routes/AuthRoutes");
app.use("/api/auth", AuthRoutes);
app.get("/", (req, res) => {
  res.send("Hello World");
});
const MONGO_URI =
  // process.env.MONGO_URI ||
  // "mongodb+srv://heLp_desk_db:abcd1234@ecommerce-cluster.cwliozz.mongodb.net/";
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("✅ Connected to DB");
    })
    .catch((err) => {
      console.log("❌ Error connecting to DB", err);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
