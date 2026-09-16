const Ticket = require("../model/Ticket");
const cloudinary = require("../config/cloudinary");
// ==========================================
// CREATE TICKET
// POST /api/tickets
// ==========================================

const createTicket = async (req, res) => {
  try {
    const { title, description, department, priority } = req.body;
    let attachment = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "helpomania/tickets",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        uploadStream.end(req.file.buffer);
      });

      attachment = {
        url: result.secure_url,
        publicId: result.public_id,
        fileType: req.file.mimetype,
        fileName: req.file.originalname,
      };
    }

    // ------------------------------------------
    // Basic validation
    // ------------------------------------------

    if (!title || !description || !department) {
      return res.status(400).json({
        message: "Title, description and department are required",
      });
    }

    // ------------------------------------------
    // Create ticket
    // ------------------------------------------
    // IMPORTANT:
    // createdBy comes from the JWT.
    // NEVER trust createdBy from req.body.
    // ------------------------------------------

    const ticket = await Ticket.create({
      title,
      description,
      department,
      priority,
      createdBy: req.user.userId,
      attachment,
    });

    // Populate user information before returning
    await ticket.populate("createdBy", "name email role");

    return res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("Create ticket error:", error);

    return res.status(500).json({
      message: "Failed to create ticket",
      error: error.message,
    });
  }
};

// ==========================================
// GET TICKETS
// GET /api/tickets
// ==========================================
//
// USER:
//     Get only tickets created by themselves
//
// SUPPORT:
//     Get only tickets assigned to themselves
//
// ADMIN:
//     Get all tickets
//
// ==========================================

const getTickets = async (req, res) => {
  try {
    let tickets;

    // ------------------------------------------
    // USER
    // ------------------------------------------

    if (req.user.role === "user") {
      tickets = await Ticket.find({
        createdBy: req.user.userId,
      })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    }

    // ------------------------------------------
    // SUPPORT
    // ------------------------------------------
    else if (req.user.role === "support") {
      tickets = await Ticket.find({
        assignedTo: req.user.userId,
      })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    }

    // ------------------------------------------
    // ADMIN
    // ------------------------------------------
    else if (req.user.role === "admin") {
      tickets = await Ticket.find()
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    }

    // ------------------------------------------
    // Unknown role
    // ------------------------------------------
    else {
      return res.status(403).json({
        message: "Invalid user role",
      });
    }

    return res.status(200).json({
      message: "Tickets fetched successfully",
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Get tickets error:", error);

    return res.status(500).json({
      message: "Failed to fetch tickets",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE TICKET
// GET /api/tickets/:id
// ==========================================
//
// USER:
//     Can view only their own ticket
//
// SUPPORT:
//     Can view only tickets assigned to them
//
// ADMIN:
//     Can view any ticket
//
// ==========================================

const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    let ticket;

    // ------------------------------------------
    // USER
    // ------------------------------------------

    if (req.user.role === "user") {
      ticket = await Ticket.findOne({
        _id: id,
        createdBy: req.user.userId,
      })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role");
    }

    // ------------------------------------------
    // SUPPORT
    // ------------------------------------------
    else if (req.user.role === "support") {
      ticket = await Ticket.findOne({
        _id: id,
        assignedTo: req.user.userId,
      })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role");
    }

    // ------------------------------------------
    // ADMIN
    // ------------------------------------------
    else if (req.user.role === "admin") {
      ticket = await Ticket.findById(id)
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role");
    }

    // ------------------------------------------
    // Unknown role
    // ------------------------------------------
    else {
      return res.status(403).json({
        message: "Invalid user role",
      });
    }

    // ------------------------------------------
    // Ticket not found OR not accessible
    // ------------------------------------------

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found or you do not have access to this ticket",
      });
    }

    return res.status(200).json({
      message: "Ticket fetched successfully",
      ticket,
    });
  } catch (error) {
    console.error("Get ticket error:", error);

    return res.status(500).json({
      message: "Failed to fetch ticket",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE TICKET
// PUT /api/tickets/:id
// ==========================================
//
// USER:
//     Can update title, description, department,
//     priority of their own ticket.
//
// SUPPORT:
//     Can update status of assigned ticket.
//
// ADMIN:
//     Can update everything.
//
// ==========================================

const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, department, priority, status, assignedTo } =
      req.body;

    // ------------------------------------------
    // Find ticket
    // ------------------------------------------

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    // ==========================================
    // USER
    // ==========================================

    if (req.user.role === "user") {
      // User can only modify their own tickets

      if (ticket.createdBy.toString() !== req.user.userId.toString()) {
        return res.status(403).json({
          message: "You are not allowed to update this ticket",
        });
      }

      // User cannot modify assignment or status

      if (assignedTo !== undefined || status !== undefined) {
        return res.status(403).json({
          message: "You cannot modify assignedTo or status",
        });
      }

      // Update allowed fields

      if (title !== undefined) {
        ticket.title = title;
      }

      if (description !== undefined) {
        ticket.description = description;
      }

      if (department !== undefined) {
        ticket.department = department;
      }

      if (priority !== undefined) {
        ticket.priority = priority;
      }
    }

    // ==========================================
    // SUPPORT
    // ==========================================
    else if (req.user.role === "support") {
      // Support can modify only tickets
      // assigned to them

      if (
        !ticket.assignedTo ||
        ticket.assignedTo.toString() !== req.user.userId.toString()
      ) {
        return res.status(403).json({
          message: "You can only update tickets assigned to you",
        });
      }

      // Support cannot change ownership

      if (title !== undefined) {
        ticket.title = title;
      }

      if (description !== undefined) {
        ticket.description = description;
      }

      if (department !== undefined) {
        ticket.department = department;
      }

      if (priority !== undefined) {
        ticket.priority = priority;
      }

      // Support can update status

      if (status !== undefined) {
        ticket.status = status;
      }

      // Support cannot assign tickets

      if (assignedTo !== undefined) {
        return res.status(403).json({
          message: "Only admin can assign tickets",
        });
      }
    }

    // ==========================================
    // ADMIN
    // ==========================================
    else if (req.user.role === "admin") {
      // Admin can update everything

      if (title !== undefined) {
        ticket.title = title;
      }

      if (description !== undefined) {
        ticket.description = description;
      }

      if (department !== undefined) {
        ticket.department = department;
      }

      if (priority !== undefined) {
        ticket.priority = priority;
      }

      if (status !== undefined) {
        ticket.status = status;
      }

      if (assignedTo !== undefined) {
        ticket.assignedTo = assignedTo;
      }
    }

    // ==========================================
    // INVALID ROLE
    // ==========================================
    else {
      return res.status(403).json({
        message: "Invalid user role",
      });
    }

    // ------------------------------------------
    // Save updated ticket
    // ------------------------------------------

    await ticket.save();

    // Populate references

    await ticket.populate("createdBy", "name email role");
    await ticket.populate("assignedTo", "name email role");

    return res.status(200).json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    console.error("Update ticket error:", error);

    return res.status(500).json({
      message: "Failed to update ticket",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE TICKET
// DELETE /api/tickets/:id
// ==========================================
//
// ONLY ADMIN SHOULD BE ABLE TO DELETE.
//
// Role middleware should ALSO protect this
// route, but we check here as an additional
// layer of protection.
//
// ==========================================

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    // ------------------------------------------
    // Only admin can delete
    // ------------------------------------------

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete tickets",
      });
    }

    // ------------------------------------------
    // Find ticket
    // ------------------------------------------

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    // ------------------------------------------
    // Delete ticket
    // ------------------------------------------

    await Ticket.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Delete ticket error:", error);

    return res.status(500).json({
      message: "Failed to delete ticket",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};
