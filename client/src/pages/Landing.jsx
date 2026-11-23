import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Mascot from "../components/Mascot";

const FEATURES = [
  {
    icon: "🔐",
    note: "you got this!",
    title: "Protected Credential Vault",
    desc: "Store website names, URLs, usernames, categories, and passwords behind JWT authentication and protected API routes.",
  },
  {
    icon: "✨",
    note: "custom rules",
    title: "Smart Rule-Based Generator",
    desc: "Generate strong passwords with the right length, uppercase/lowercase letters, digits, and symbols instead of reusing weak ones.",
  },
  {
    icon: "🔎",
    note: "instant find",
    title: "Search & Category Tags",
    desc: "Filter saved logins by website, URL, or username and organize accounts into clean categories.",
  },
  {
    icon: "📱",
    note: "little by little",
    title: "Mobile-Ready & Editable",
    desc: "Add new logins, edit existing entries, toggle password visibility, and copy keys smoothly on mobile or desktop.",
  },
];

const SAMPLE_VAULT_ITEMS = [
  {
    id: "gh",
    site: "GitHub",
    category: "Coding & Dev",
    user: "Alfee123-web",
    masked: "••••••••••••••",
    revealed: "Gh#92kLm!8xP2",
  },
  {
    id: "uni",
    site: "College Portal",
    category: "Study",
    user: "student@bbdniit.ac.in",
    masked: "••••••••••••",
    revealed: "Bbd@2027Key$",
  },
  {
    id: "mail",
    site: "Personal Mail",
    category: "Daily",
    user: "alfee@lockr.app",
    masked: "•••••••••••••••",
    revealed: "Sun#48Berry!9Qz",
  },
  {
    id: "db",
    site: "Cloud Console",
    category: "Coding & Dev",
    user: "dev-admin",
    masked: "•••••••••••••",
    revealed: "Vault$71Mint#4K",
  },
];

const CATEGORIES = ["All", "Coding & Dev", "Study", "Daily"];

const PRESETS = [
  {
    label: "16-Char Full Mix",
    rule: "Uppercase + lowercase + digits + symbols",
    make: () => buildKey(16, true, true, true),
  },
  {
    label: "12-Char Letters & Digits",
    rule: "Alphanumeric only (no special symbols)",
    make: () => buildKey(12, true, true, false),
  },
  {
    label: "20-Char Diamond Key",
    rule: "Maximum length & character variety",
    make: () => buildKey(20, true, true, true),
  },
];

const ARCHITECTURE_STEPS = [
  {
    step: "01",
    label: "Add / Edit Form",
    detail: "Enter site, URL, username, category & secret",
  },
  {
    step: "02",
    label: "Protected Backend",
    detail: "Authenticated via JWT & guarded API middleware",
  },
  {
    step: "03",
    label: "Masked Vault Card",
    detail: "Hidden by default on desktop & mobile grid",
  },
  {
    step: "04",
    label: "On-Demand Reveal",
    detail: "Eye toggle & one-tap copy when you need it",
  },
];

function buildKey(length, upper, digits, symbols) {
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const upperSet = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numSet = "23456789";
  const symSet = "!@#$%^&*+-=?";

  let pool = lower;
  const picks = [lower[Math.floor(Math.random() * lower.length)]];

  if (upper) {
    pool += upperSet;
    picks.push(upperSet[Math.floor(Math.random() * upperSet.length)]);
  }
  if (digits) {
    pool += numSet;
    picks.push(numSet[Math.floor(Math.random() * numSet.length)]);
  }
  if (symbols) {
    pool += symSet;
    picks.push(symSet[Math.floor(Math.random() * symSet.length)]);
  }

  while (picks.length < length) {
    picks.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  for (let i = picks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }

  return picks.join("");
}

function getStrengthInfo(secret) {
  const len = secret.length;
  const hasUpper = /[A-Z]/.test(secret);
  const hasLower = /[a-z]/.test(secret);
  const hasNum = /[0-9]/.test(secret);
  const hasSym = /[^A-Za-z0-9]/.test(secret);
  const variety = [hasUpper, hasLower, hasNum, hasSym].filter(Boolean).length;

  const score = Math.min(100, len * 4 + variety * 10);

  if (score >= 85 || len >= 18) {
    return {
      score: 100,
      tier: "Diamond Vault",
      crackTime: "Centuries (offline brute-force)",
      tone: "strong",
    };
  }
  if (score >= 65) {
    return {
      score: 76,
      tier: "Strong Key",
      crackTime: "Years to crack",
      tone: "medium",
    };
  }
  return {
    score: 42,
    tier: "Cozy Starter",
    crackTime: "Days to weeks — add length/mix",
    tone: "weak",
  };
}

export default function Landing() {
  const navigate = useNavigate();
  const hasToken = Boolean(localStorage.getItem("token"));

  const [chestOpen, setChestOpen] = useState(false);
  const [unlockingNav, setUnlockingNav] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [revealedIds, setRevealedIds] = useState({});

  const [presetIdx, setPresetIdx] = useState(0);
  const [playgroundKey, setPlaygroundKey] = useState(() =>
    PRESETS[0].make()
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!unlockingNav) return;
    const timer = setTimeout(() => {
      navigate(hasToken ? "/vault" : "/login?mode=signup");
    }, 420);
    return () => clearTimeout(timer);
  }, [unlockingNav, hasToken, navigate]);

  const handleGetStarted = () => {
    if (unlockingNav) return;
    setChestOpen(true);
    setUnlockingNav(true);
  };

  const toggleSampleReveal = (id) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePresetPick = (idx) => {
    setPresetIdx(idx);
    setPlaygroundKey(PRESETS[idx].make());
    setCopied(false);
  };

  const handleRegenerate = () => {
    setPlaygroundKey(PRESETS[presetIdx].make());
    setCopied(false);
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(playgroundKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const filteredPreviewItems =
    activeCategory === "All"
      ? SAMPLE_VAULT_ITEMS
      : SAMPLE_VAULT_ITEMS.filter((item) => item.category === activeCategory);

  const strength = getStrengthInfo(playgroundKey);

  return (
    <main className="landing-page">
      {/* Ambient floating sparkles & bows */}
      <div className="landing-sparkle l-sparkle-1">🎀</div>
      <div className="landing-sparkle l-sparkle-2">✦</div>
      <div className="landing-sparkle l-sparkle-3">♡</div>

      {/* Top Bar */}
      <header className="landing-navbar">
        <div className="vault-brand">
          <Logo size={46} />
          <div>
            <h1>Lockr</h1>
            <span>Cozy &amp; secure password vault</span>
          </div>
        </div>

        <nav className="landing-nav-links" aria-label="Landing navigation">
          <a href="#what-it-does">What It Does</a>
          <a href="#playground">Strength Lab</a>
          <a href="#architecture">How It Works</a>
        </nav>

        <div className="landing-nav-cta">
          {hasToken ? (
            <Link to="/vault" className="landing-secondary-btn">
              Open Vault ↗
            </Link>
          ) : (
            <Link to="/login" className="landing-secondary-btn">
              Log in
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section — GET STARTED #1 */}
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="welcome-eyebrow">
            🍓 SWEET DESK SECURITY · ONE PLACE FOR ALL YOUR KEYS
          </span>

          <h1>
            Little by little,
            <span> keep every login safe.</span>
          </h1>

          <p className="landing-hero-desc">
            Lockr is a full-stack password manager built with React, Express,
            and MongoDB. Save account credentials, generate rule-friendly
            passwords, filter by category, and reveal secrets only when you need
            them.
          </p>

          <div className="landing-hero-actions">
            <button
              type="button"
              className="landing-primary-btn landing-btn-reset"
              onClick={handleGetStarted}
              disabled={unlockingNav}
            >
              {unlockingNav
                ? "🔓 Turning key..."
                : hasToken
                  ? "Open My Vault ↗"
                  : "Get Started ↗"}
            </button>

            <a href="#what-it-does" className="landing-secondary-btn">
              Explore Vault
            </a>
          </div>

          <div className="landing-trust-pills">
            <span>🔒 JWT &amp; Helmet Guarded</span>
            <span>✨ Rule-Based Generator</span>
            <span>📱 Mobile Form Ready</span>
          </div>
        </div>

        {/* Interactive Treasure Box + Cat Mascot + Category Filter Card */}
        <div className="landing-hero-card">
          <div
            className={`landing-chest-stage ${chestOpen ? "is-open" : ""}`}
            onClick={() => setChestOpen((prev) => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setChestOpen((prev) => !prev);
              }
            }}
            aria-label="Open or close treasure box preview"
          >
            <span className="landing-orbit orbit-1">✦</span>
            <span className="landing-orbit orbit-2">♡</span>
            <span className="landing-orbit orbit-3">🎀</span>

            <div className="landing-mini-chest">
              <div className="mini-chest-lid">
                <span className="mini-chest-bow">🎀</span>
              </div>
              <div className="mini-chest-glow">🔑 ✨ 🍓</div>
              <div className="mini-chest-body">
                <span className="mini-chest-lock">
                  {chestOpen ? "🔓" : "♥"}
                </span>
              </div>
            </div>

            <div className="landing-mascot-side">
              <Mascot size={106} />
              <span className="chest-tap-hint">
                {chestOpen
                  ? "✨ Chest open! Tap to close"
                  : "👆 Tap chest to open"}
              </span>
            </div>
          </div>

          {/* Interactive Category Filter Preview */}
          <div className="landing-preview-vault">
            <div className="preview-vault-header">
              <strong>Interactive Vault Filter</strong>
              <span className="badge-pink">
                {filteredPreviewItems.length} shown
              </span>
            </div>

            <div className="landing-filter-pills" role="tablist">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`landing-filter-pill ${
                    activeCategory === cat ? "is-active" : ""
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="preview-items-stack">
              {filteredPreviewItems.map((item) => {
                const isShown = Boolean(revealedIds[item.id]);
                return (
                  <div key={item.id} className="preview-entry-row">
                    <div className="preview-site-dot">
                      {item.site.slice(0, 1)}
                    </div>
                    <div className="preview-entry-meta">
                      <strong>{item.site}</strong>
                      <span>
                        {item.user} · <em>{item.category}</em>
                      </span>
                    </div>
                    <code className="preview-secret-code">
                      {isShown ? item.revealed : item.masked}
                    </code>
                    <button
                      type="button"
                      className="preview-peek-btn"
                      onClick={() => toggleSampleReveal(item.id)}
                      aria-label={
                        isShown
                          ? `Hide ${item.site} password`
                          : `Reveal ${item.site} password`
                      }
                    >
                      {isShown ? "🙈" : "👁"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* What Lockr Actually Does */}
      <section id="what-it-does" className="landing-section">
        <div className="landing-section-head">
          <span className="section-eyebrow">WHAT LOCKR ACTUALLY DOES</span>
          <h2>Everything you need in one cozy vault</h2>
          <p>
            Designed so your logins stay organized, searchable, and protected
            without cluttered menus.
          </p>
        </div>

        <div className="landing-feature-grid">
          {FEATURES.map((feat) => (
            <article key={feat.title} className="landing-feature-card">
              <div className="feature-card-top">
                <div className="feature-icon-box">{feat.icon}</div>
                <span className="feature-sticky-tag">📌 {feat.note}</span>
              </div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Password Strength & Generator Lab */}
      <section id="playground" className="landing-demo-box">
        <div className="landing-demo-info">
          <span className="section-eyebrow">STRENGTH &amp; GENERATOR LAB</span>
          <h2>Test key strength before you sign up</h2>
          <p>
            Pick a preset or type your own sample string on the right to see
            how Lockr scores variety, length, and estimated crack resistance.
          </p>

          <div className="landing-preset-list">
            {PRESETS.map((preset, idx) => (
              <button
                key={preset.label}
                type="button"
                className={`landing-preset-btn ${
                  presetIdx === idx ? "active" : ""
                }`}
                onClick={() => handlePresetPick(idx)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="landing-demo-card">
          <span className="generator-label">
            {PRESETS[presetIdx].rule.toUpperCase()}
          </span>

          <input
            type="text"
            className="landing-strength-input"
            value={playgroundKey}
            onChange={(e) => {
              setPlaygroundKey(e.target.value);
              setCopied(false);
            }}
            aria-label="Test or edit sample password"
            placeholder="Type or generate a sample key..."
          />

          {/* Strength Meter */}
          <div className="strength-meter-block">
            <div className="strength-meter-meta">
              <span className={`strength-badge tone-${strength.tone}`}>
                {strength.tier}
              </span>
              <span className="strength-crack-text">{strength.crackTime}</span>
            </div>

            <div className="strength-track" aria-hidden="true">
              <div
                className={`strength-fill tone-${strength.tone}`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
          </div>

          <div className="landing-demo-actions">
            <button
              type="button"
              className="generator-regenerate"
              onClick={handleRegenerate}
            >
              ↻ Regenerate
            </button>
            <button
              type="button"
              className="generator-use landing-btn-reset"
              onClick={handleCopyKey}
            >
              {copied ? "Copied ✓" : "Copy Sample Key"}
            </button>
          </div>
        </div>
      </section>

      {/* Security & Architecture Flow */}
      <section id="architecture" className="landing-section">
        <div className="landing-section-head">
          <span className="section-eyebrow">HOW IT WORKS</span>
          <h2>From form input to protected vault card</h2>
        </div>

        <div className="landing-arch-grid">
          {ARCHITECTURE_STEPS.map((item) => (
            <div key={item.step} className="landing-step-card">
              <span className="step-badge">Step {item.step}</span>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner — GET STARTED #2 */}
      <section className="landing-cta-banner">
        <div>
          <h2>Ready to open your personal Lockr vault?</h2>
          <p>
            Start storing your logins cleanly—little by little, day by day.
          </p>
        </div>

        <button
          type="button"
          className="landing-primary-btn landing-btn-reset"
          onClick={handleGetStarted}
          disabled={unlockingNav}
        >
          {unlockingNav
            ? "🔓 Opening..."
            : hasToken
              ? "Open My Vault 🎀"
              : "Get Started 🎀"}
        </button>
      </section>

      <footer className="vault-footer">
        <span>Made with ♡ by Lockr</span>
        <span>Keep your keys safe, always. ✨</span>
      </footer>
    </main>
  );
}