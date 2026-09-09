const bcrypt = require("bcryptjs");

// In-memory data store for HelpDesk
const defaultPasswordHash = bcrypt.hashSync("password123", 10);

const users = [
  {
    id: 1,
    _id: "66d1a1000000000000000001",
    name: "Demo User",
    email: "user@helpdesk.com",
    password: defaultPasswordHash,
    role: "user",
    department: "IT",
    phone: "555-0101",
    createdAt: new Date(Date.now() - 7 * 86400000),
    updatedAt: new Date(Date.now() - 7 * 86400000),
  },
  {
    id: 2,
    _id: "66d1a1000000000000000002",
    name: "Support Specialist",
    email: "support@helpdesk.com",
    password: defaultPasswordHash,
    role: "support",
    department: "IT Support",
    phone: "555-0102",
    createdAt: new Date(Date.now() - 7 * 86400000),
    updatedAt: new Date(Date.now() - 7 * 86400000),
  },
  {
    id: 3,
    _id: "66d1a1000000000000000003",
    name: "Admin Manager",
    email: "admin@helpdesk.com",
    password: defaultPasswordHash,
    role: "admin",
    department: "Administration",
    phone: "555-0103",
    createdAt: new Date(Date.now() - 7 * 86400000),
    updatedAt: new Date(Date.now() - 7 * 86400000),
  },
];

let nextUserId = 4;
let nextTicketId = 4;

function generateObjectId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
  const random = Math.floor(Math.random() * 0xffffffffffff).toString(16).padStart(16, "0");
  return timestamp + random;
}

const rawTickets = [
  {
    id: 1,
    _id: "66d1a1000000000000000011",
    title: "Cannot connect to VPN from home office",
    description: "Whenever I try connecting to the primary corporate VPN, it times out with error code 403.",
    department: "it-support",
    priority: "high",
    status: "in-progress",
    createdBy: 1,
    assignedTo: 2,
    attachment: null,
    createdAt: new Date(Date.now() - 2 * 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 2,
    _id: "66d1a1000000000000000012",
    title: "Request for Ricoh floor printer setup",
    description: "Need the latest PCL6 drivers and network printer mapping for the 3rd floor Ricoh device.",
    department: "hardware",
    priority: "low",
    status: "open",
    createdBy: 1,
    assignedTo: null,
    attachment: null,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 3,
    _id: "66d1a1000000000000000013",
    title: "Financial report export timeout",
    description: "Exporting end-of-month financial reports in CSV format was throwing a timeout error.",
    department: "accounts",
    priority: "urgent",
    status: "resolved",
    createdBy: 1,
    assignedTo: 2,
    attachment: null,
    createdAt: new Date(Date.now() - 3 * 86400000),
    updatedAt: new Date(Date.now() - 43200000),
  },
];

class TicketDoc {
  constructor(data) {
    Object.assign(this, data);
  }

  async populate(field, select) {
    const fields = typeof select === "string" ? select.split(" ") : null;
    const project = (user) => {
      if (!user) return null;
      if (!fields) return { id: user.id, _id: user._id, name: user.name, email: user.email, role: user.role };
      const out = { id: user.id, _id: user._id };
      fields.forEach((f) => {
        if (user[f] !== undefined) out[f] = user[f];
      });
      return out;
    };

    if (field === "createdBy") {
      const u = users.find((x) => x.id === Number(this.createdBy) || x._id === String(this.createdBy) || x.id === this.createdBy);
      this.createdBy = project(u);
    } else if (field === "assignedTo") {
      const u = users.find((x) => x.id === Number(this.assignedTo) || x._id === String(this.assignedTo) || x.id === this.assignedTo);
      this.assignedTo = project(u);
    }
    return this;
  }

  async save() {
    this.updatedAt = new Date();
    const idx = rawTickets.findIndex((t) => t.id === this.id || t._id === this._id);
    const plain = { ...this };
    if (this.createdBy && typeof this.createdBy === "object") {
      plain.createdBy = this.createdBy.id || this.createdBy._id;
    }
    if (this.assignedTo && typeof this.assignedTo === "object") {
      plain.assignedTo = this.assignedTo.id || this.assignedTo._id;
    }
    if (idx >= 0) {
      rawTickets[idx] = plain;
    } else {
      rawTickets.push(plain);
    }
    return this;
  }
}

class Query {
  constructor(promise) {
    this.promise = promise;
    this.populates = [];
    this.sortCriteria = null;
  }

  populate(field, select) {
    this.populates.push({ field, select });
    return this;
  }

  sort(criteria) {
    this.sortCriteria = criteria;
    return this;
  }

  async then(resolve, reject) {
    try {
      let result = await this.promise;
      if (Array.isArray(result)) {
        if (this.sortCriteria && this.sortCriteria.createdAt === -1) {
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        for (const doc of result) {
          for (const pop of this.populates) {
            await doc.populate(pop.field, pop.select);
          }
        }
      } else if (result) {
        for (const pop of this.populates) {
          await result.populate(pop.field, pop.select);
        }
      }
      return resolve(result);
    } catch (err) {
      return reject(err);
    }
  }
}

const db = {
  users,
  rawTickets,

  findUserById(id) {
    return users.find((u) => u.id === Number(id) || u._id === String(id)) || null;
  },

  findUserByEmail(email) {
    if (!email) return null;
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  createUser(data) {
    const id = nextUserId++;
    const _id = generateObjectId();
    const user = {
      id,
      _id,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || "user",
      department: data.department || "General",
      phone: data.phone || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(user);
    return user;
  },

  createTicket(data) {
    const id = nextTicketId++;
    const _id = generateObjectId();
    const raw = {
      id,
      _id,
      title: data.title,
      description: data.description,
      department: data.department,
      priority: data.priority || "medium",
      status: data.status || "open",
      createdBy: data.createdBy,
      assignedTo: data.assignedTo || null,
      attachment: data.attachment || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    rawTickets.unshift(raw);
    return new TicketDoc({ ...raw });
  },

  findTickets(filter = {}) {
    const promise = (async () => {
      let list = rawTickets.map((t) => new TicketDoc({ ...t }));
      if (filter.createdBy !== undefined) {
        list = list.filter((t) => {
          const cid = t.createdBy;
          return cid === filter.createdBy || cid === Number(filter.createdBy) || String(cid) === String(filter.createdBy);
        });
      }
      if (filter.assignedTo !== undefined) {
        list = list.filter((t) => {
          const aid = t.assignedTo;
          return aid === filter.assignedTo || aid === Number(filter.assignedTo) || String(aid) === String(filter.assignedTo);
        });
      }
      return list;
    })();
    return new Query(promise);
  },

  findTicketById(id) {
    const promise = (async () => {
      const raw = rawTickets.find((t) => t._id === String(id) || t.id === Number(id));
      if (!raw) return null;
      return new TicketDoc({ ...raw });
    })();
    return new Query(promise);
  },

  findOneTicket(filter = {}) {
    const promise = (async () => {
      let list = rawTickets.map((t) => new TicketDoc({ ...t }));
      if (filter._id !== undefined) {
        list = list.filter((t) => t._id === String(filter._id) || t.id === Number(filter._id));
      }
      if (filter.createdBy !== undefined) {
        list = list.filter((t) => {
          const cid = t.createdBy;
          return cid === filter.createdBy || cid === Number(filter.createdBy) || String(cid) === String(filter.createdBy);
        });
      }
      if (filter.assignedTo !== undefined) {
        list = list.filter((t) => {
          const aid = t.assignedTo;
          return aid === filter.assignedTo || aid === Number(filter.assignedTo) || String(aid) === String(filter.assignedTo);
        });
      }
      return list[0] || null;
    })();
    return new Query(promise);
  },

  deleteTicket(id) {
    const idx = rawTickets.findIndex((t) => t._id === String(id) || t.id === Number(id));
    if (idx >= 0) {
      rawTickets.splice(idx, 1);
      return true;
    }
    return false;
  },
};

module.exports = db;
