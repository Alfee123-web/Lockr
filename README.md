# 🔐 Lockr

**One place for all your keys.** Lockr is a full-stack MERN password manager with encrypted storage, instant search, and a smart generator that builds passwords to match any site's rules.

> ⚠️ **Educational project.** Lockr has not been professionally audited. Don't use it for passwords you can't afford to lose.

<!-- Add a screenshot or GIF here later: ![Lockr screenshot](docs/screenshot.png) -->

## ✨ Features

- **Secure accounts:** sign up and log in with JWT authentication
- **Encrypted vault:** every saved password is encrypted with AES-256-GCM
- **Instant search:** find logins by site name, link, or username
- **Smart password generator:** paste a site's password rules (e.g. "8-12 characters, one capital, one digit, symbols such as !@#") and get a matching password
- **Reveal and copy:** passwords stay hidden by default, auto-hide after 10 seconds, and the clipboard clears after 15 seconds
- **Per-user isolation:** every query is scoped to the logged-in user

## 🛠️ Tech stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas free tier works)
- **Security:** bcrypt, JWT, AES-256-GCM, Helmet, express-rate-limit

## 🚀 Getting started

### Prerequisites

- Node.js 18+
- A MongoDB database (local or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Clone the repo

```bash
git clone https://github.com/Alfee123-web/Lockr.git
cd Lockr
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` (use `.env.example` as a guide):

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
ENC_KEY=64_hex_characters
```

Generate `JWT_SECRET` and `ENC_KEY` by running this command twice, once for each:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start the server:

```bash
npm run dev
```

### 3. Set up the frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173** and create an account.

## 🔒 How security works

- **Login passwords** are hashed with bcrypt and never stored in plain text.
- **Saved passwords** are encrypted with AES-256-GCM, using a unique random IV per entry, before they reach the database.
- **Sessions** use JWTs that expire after 1 hour.
- **Brute-force protection:** login and signup are rate limited to 10 failed attempts per 15 minutes per IP.
- **Secure headers** are set with Helmet.
- **Data isolation:** every database query includes the user's ID, so users can't read each other's entries.

**Current limitation:** encryption happens on the server using a key from `.env`. That protects against database leaks, but whoever controls the server key could decrypt entries. Client-side (zero-knowledge) encryption is on the roadmap.

## 🗺️ Roadmap

- [ ] Edit entries and filter by category
- [ ] Client-side (zero-knowledge) encryption
- [ ] Password health dashboard (weak, reused, old)
- [ ] Breach check with Have I Been Pwned (k-anonymity)
- [ ] Encrypted import/export (Chrome and Bitwarden CSV)
- [ ] TOTP 2FA code generator
- [ ] Browser extension with autofill

## 📄 License

MIT