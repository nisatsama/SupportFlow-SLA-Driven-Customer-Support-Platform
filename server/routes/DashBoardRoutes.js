const express = require("express");

const router = express.Router();

const protect = require("../middleware/AuthMiddleware");
const authorize = require("../middleware/RoleMiddleware");

// USER DASHBOARD
router.get("/user", protect, authorize("user"), (req, res) => {
  res.json({
    message: "Welcome to User Dashboard",
    user: req.user,
  });
});

// SUPPORT DASHBOARD
router.get("/support", protect, authorize("support"), (req, res) => {
  res.json({
    message: "Welcome to Support Dashboard",
    user: req.user,
  });
});

// ADMIN DASHBOARD
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({
    message: "Welcome to Admin Dashboard",
    user: req.user,
  });
});

module.exports = router;
