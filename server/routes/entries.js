const router = require("express").Router();
const Entry = require("../models/Entry");
const auth = require("../middleware/auth");
const { encrypt, decrypt } = require("../utils/crypto");

router.use(auth);

// List + search + filter (passwords stay encrypted in the list)
router.get("/", async (req, res) => {
  const { q, category } = req.query;
  const filter = { userId: req.userId };
  if (category) filter.category = category;

  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ siteName: rx }, { url: rx }, { username: rx }];
  }

  const entries = await Entry.find(filter)
    .select("-encPassword")
    .sort("-createdAt");
  res.json(entries);
});

// Reveal one password on demand
router.get("/:id/reveal", async (req, res) => {
  const e = await Entry.findOne({ _id: req.params.id, userId: req.userId });
  if (!e) return res.status(404).json({ msg: "Not found" });
  res.json({ password: decrypt(e.encPassword) });
});

// Add a new entry
router.post("/", async (req, res) => {
  const { siteName, url, username, password, category, passwordRules } = req.body;
  if (!siteName || !password)
    return res.status(400).json({ msg: "siteName and password required" });

  const e = await Entry.create({
    userId: req.userId,
    siteName,
    url,
    username,
    category,
    passwordRules,
    encPassword: encrypt(password),
  });
  res.json({ ...e.toObject(), encPassword: undefined });
});

// Edit an entry
router.put("/:id", async (req, res) => {
  const { password, ...rest } = req.body;
  const update = { ...rest };
  if (password) update.encPassword = encrypt(password);

  const e = await Entry.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    update,
    { new: true }
  ).select("-encPassword");

  if (!e) return res.status(404).json({ msg: "Not found" });
  res.json(e);
});

// Delete an entry
router.delete("/:id", async (req, res) => {
  await Entry.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ msg: "Deleted" });
});

module.exports = router;