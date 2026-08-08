const User = require("../model/User");

const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password, department, phone } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password || !department || !phone) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    // 4. Create user
    const user = await User.create({
      name,
      email,
      password,
      department,
      phone,
      role: "user",
    });

    // 5. Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // 6. Send response
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
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
};
