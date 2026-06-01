const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Community = require("../models/Community");

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, homeCity: user.homeCity, subscription: user.subscription },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, city } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already in use" });

    // Validate that city exists in our communities
    const community = await Community.findOne({ city: new RegExp(`^${city}$`, "i") });
    if (!community)
      return res.status(400).json({ message: "City not found. Please enter a valid LA County city." });

    const user = await User.create({ name, email, password, homeCity: community.city });

    // Increment community member count
    await Community.findByIdAndUpdate(community._id, { $inc: { memberCount: 1 } });

    res.status(201).json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, homeCity: user.homeCity },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, homeCity: user.homeCity },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };
