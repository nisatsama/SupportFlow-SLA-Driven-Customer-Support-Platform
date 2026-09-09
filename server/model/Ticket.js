const db = require("../db");

// Mock model providing Mongoose-compatible interface with in-memory persistence
const mockTicketModel = {
  create: async (data) => {
    return db.createTicket(data);
  },
  find: (filter) => {
    return db.findTickets(filter);
  },
  findOne: (filter) => {
    return db.findOneTicket(filter);
  },
  findById: (id) => {
    return db.findTicketById(id);
  },
  findByIdAndDelete: async (id) => {
    return db.deleteTicket(id);
  },
};

module.exports = mockTicketModel;
