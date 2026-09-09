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
      if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ) {
        try {
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
        } catch (uploadErr) {
          console.warn("Cloudinary upload failed, using fallback data URI:", uploadErr.message);
          attachment = {
            url: `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            publicId: "local_" + Date.now(),
            fileType: req.file.mimetype,
            fileName: req.file.originalname,
          };
        }
      } else {
        // Cloudinary not configured: store as data URI
        attachment = {
          url: `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
          publicId: "local_" + Date.now(),
          fileType: req.file.mimetype,
          fileName: req.file.originalname,
        };
      }
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

    const ticket = await Ticket.create({
      title,
      description,
      department,
      priority: priority || "medium",
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

const getTickets = async (req, res) => {
  try {
    let tickets;

    if (req.user.role === "user") {
      tickets = await Ticket.find({
        createdBy: req.user.userId,
      })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    } else if (req.user.role === "support") {
      tickets = await Ticket.find({
        assignedTo: req.user.userId,
      })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    } else if (req.user.role === "admin") {
      tickets = await Ticket.find()
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    } else {
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

const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    let ticket;

    if (req.user.role === "user") {
      ticket = await Ticket.findOne({
        _id: id,
        createdBy: req.user.userId,
      })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role");
    } else if (req.user.role === "support") {
      ticket = await Ticket.findOne({
        _id: id,
        assignedTo: req.user.userId,
      })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role");
    } else if (req.user.role === "admin") {
      ticket = await Ticket.findById(id)
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role");
    } else {
      return res.status(403).json({
        message: "Invalid user role",
      });
    }

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found or you do not have access to this ticket",
      });
    }

    // Ensure attachments array exists for UI components expecting it
    if (ticket.attachment && !ticket.attachments) {
      ticket.attachments = [ticket.attachment];
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

const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, department, priority, status, assignedTo } =
      req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const createdById = ticket.createdBy
      ? (ticket.createdBy._id || ticket.createdBy.id || ticket.createdBy).toString()
      : "";

    if (req.user.role === "user") {
      if (createdById !== req.user.userId.toString()) {
        return res.status(403).json({
          message: "You are not allowed to update this ticket",
        });
      }

      if (assignedTo !== undefined || status !== undefined) {
        return res.status(403).json({
          message: "You cannot modify assignedTo or status",
        });
      }

      if (title !== undefined) ticket.title = title;
      if (description !== undefined) ticket.description = description;
      if (department !== undefined) ticket.department = department;
      if (priority !== undefined) ticket.priority = priority;
    } else if (req.user.role === "support") {
      const assignedToId = ticket.assignedTo
        ? (ticket.assignedTo._id || ticket.assignedTo.id || ticket.assignedTo).toString()
        : "";

      if (!assignedToId || assignedToId !== req.user.userId.toString()) {
        return res.status(403).json({
          message: "You can only update tickets assigned to you",
        });
      }

      if (title !== undefined) ticket.title = title;
      if (description !== undefined) ticket.description = description;
      if (department !== undefined) ticket.department = department;
      if (priority !== undefined) ticket.priority = priority;
      if (status !== undefined) ticket.status = status;

      if (assignedTo !== undefined) {
        return res.status(403).json({
          message: "Only admin can assign tickets",
        });
      }
    } else if (req.user.role === "admin") {
      if (title !== undefined) ticket.title = title;
      if (description !== undefined) ticket.description = description;
      if (department !== undefined) ticket.department = department;
      if (priority !== undefined) ticket.priority = priority;
      if (status !== undefined) ticket.status = status;
      if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
    } else {
      return res.status(403).json({
        message: "Invalid user role",
      });
    }

    await ticket.save();

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

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete tickets",
      });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

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

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};
