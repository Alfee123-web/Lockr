require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

const app = express();

app.use(helmet()); // secure HTTP headers
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Max 10 failed login/signup attempts per IP every 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { msg: "Too many attempts. Try again in 15 minutes." },
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authLimiter, require("./routes/auth"));
app.use("/api/entries", require("./routes/entries"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("DB connection failed:", err.message));