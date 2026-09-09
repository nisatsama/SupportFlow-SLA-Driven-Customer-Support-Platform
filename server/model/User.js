const db = require("../db");

// Mock model providing Mongoose-compatible interface with in-memory persistence
const mockUserModel = {
  create: async (data) => {
    return db.createUser(data);
  },
  findOne: async (filter) => {
    if (filter.email) return db.findUserByEmail(filter.email);
    if (filter._id || filter.id) return db.findUserById(filter._id || filter.id);
    return null;
  },
  findById: async (id) => {
    return db.findUserById(id);
  },
  find: async () => {
    return db.users;
  },
};

module.exports = mockUserModel;
