const prisma = require("../prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "helpdesk-secret-key-2026";

const register = async (req, res) => {
  try {
    const { name, email, password, department, phone } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password || !department || !phone) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        department,
        phone,
        role: "user",
      },
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id || user._id,
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = (await bcrypt.compare(password, user.password)) || (password === user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      {
        userId: user.id || user._id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id || user._id,
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  register,
  login,
};
