const express = require("express");
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require("../controller/TicketController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
// CREATE
router.post("/", AuthMiddleware, createTicket);
// READ ALL
router.get("/", AuthMiddleware, getTickets);
// READ ONE
router.get("/:id", AuthMiddleware, getTicketById);
// UPDATE
router.put("/:id", AuthMiddleware, updateTicket);
// DELETE
router.delete("/:id", AuthMiddleware, deleteTicket);
module.exports = router;
