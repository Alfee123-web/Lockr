const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !password || password.length < 8)
      return res
        .status(400)
        .json({ msg: "Email and 8+ char password required" });

    if (await User.findOne({ email: normalizedEmail }))
      return res.status(409).json({ msg: "Email already used" });

    const user = await User.create({
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
    });
    res.json({ token: sign(user._id) });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error during signup" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const normalizedEmail =
      typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(req.body.password || "", user.password)))
      return res.status(401).json({ msg: "Invalid credentials" });

    res.json({ token: sign(user._id) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error during login" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !newPassword || newPassword.length < 8)
      return res
        .status(400)
        .json({ msg: "Valid email and 8+ char new password required" });

    const user = await User.findOne({ email: normalizedEmail });
    if (!user)
      return res.status(404).json({ msg: "No account found with that email" });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ msg: "Server error resetting password" });
  }
});

module.exports = router;