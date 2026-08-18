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
const upload = require("../middleware/upload");
router.post("/", AuthMiddleware, upload.single("attachment"), createTicket);
// READ ALL
router.get("/", AuthMiddleware, getTickets);
// READ ONE
router.get("/:id", AuthMiddleware, getTicketById);
// UPDATE
router.put("/:id", AuthMiddleware, updateTicket);
// DELETE
router.delete("/:id", AuthMiddleware, deleteTicket);
module.exports = router;
