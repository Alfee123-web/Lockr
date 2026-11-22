const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Entry",
  new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
      siteName: String,
      url: String,
      username: String,
      category: { type: String, default: "Other" },
      passwordRules: { type: String, default: "" }, // for the smart generator later
      encPassword: { data: String, iv: String, tag: String }, // AES-encrypted
    },
    { timestamps: true }
  )
);