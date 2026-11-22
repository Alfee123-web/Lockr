const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 8)
    return res.status(400).json({ msg: "Email and 8+ char password required" });

  if (await User.findOne({ email }))
    return res.status(409).json({ msg: "Email already used" });

  const user = await User.create({
    email,
    password: await bcrypt.hash(password, 12),
  });
  res.json({ token: sign(user._id) });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(401).json({ msg: "Invalid credentials" });

  res.json({ token: sign(user._id) });
});

module.exports = router;