import { useEffect, useState } from "react";
import api from "../api";
import EntryForm from "../components/EntryForm";
import EntryCard from "../components/EntryCard";
import Mascot from "../components/Mascot";

export default function Vault() {
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const reload = () => {
    setRefresh((previous) => previous + 1);
  };

  // Fetch entries with a short search debounce
  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/entries", {
          params: { q: query },
        });

        if (!cancelled) {
          setEntries(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.msg ||
              "We couldn't load your vault. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, refresh]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingEntry(null);
    reload();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleEdit = async (entry) => {
    try {
      const { data } = await api.get(`/entries/${entry._id}/reveal`);
      setEditingEntry({ ...entry, password: data.password });
      setShowForm(true);

      setTimeout(() => {
        document
          .querySelector(".vault-form-panel")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (err) {
      setError("Could not load entry for editing. Please try again.");
    }
  };

  return (
    <main className="vault vault-dashboard">
      {/* Decorative background */}
      <div className="vault-decoration decoration-one">✦</div>
      <div className="vault-decoration decoration-two">♡</div>
      <div className="vault-decoration decoration-three">✧</div>

      {/* Top navigation */}
      <header className="vault-navbar">
        <div className="vault-brand">
          <div className="vault-brand-icon">🎀</div>
          <div>
            <h1>Lockr</h1>
            <span>One place for all your keys.</span>
          </div>
        </div>

        <div className="vault-nav-actions">
          <span className="secure-label">
            <span className="secure-dot"></span>
            Your vault is private
          </span>

          <button type="button" className="logout-button" onClick={logout}>
            Log out ↗
          </button>
        </div>
      </header>

      {/* Welcome section */}
      <section className="vault-welcome">
        <div className="welcome-copy">
          <span className="welcome-eyebrow">
            ✨ YOUR LITTLE CORNER OF SECURITY
          </span>

          <h2>
            Welcome to your
            <span> sweet vault!</span>
          </h2>

          <p>All your important logins, safely tucked away in one place.</p>
        </div>

        <div className="welcome-treasure">
          <div className="treasure-sparkle sparkle-left">✦</div>
          <div className="treasure-sparkle sparkle-right">✧</div>
   <Mascot size={150} />
          <span>Your secrets are safe here!</span>
        </div>
      </section>

      {/* Vault statistics */}
      <section className="vault-stats">
        <div className="stat-card">
          <span className="stat-icon">🔐</span>
          <div>
            <strong>{entries.length}</strong>
            <span>Saved logins</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">💗</span>
          <div>
            <strong>
              {
                new Set(entries.map((entry) => entry.category || "Other")).size
              }
            </strong>
            <span>Categories</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">✨</span>
          <div>
            <strong>Protected</strong>
            <span>Your private space</span>
          </div>
        </div>
      </section>

      {/* Vault content */}
      <section className="vault-content">
        <div className="vault-section-heading">
          <div>
            <span className="section-eyebrow">YOUR COLLECTION</span>
            <h3>
              My Passwords <span>♡</span>
            </h3>
            <p>Everything you need, right where you need it.</p>
          </div>

          <button
            type="button"
            className="add-entry-button"
            onClick={() => {
              if (showForm) {
                handleCloseForm();
              } else {
                setEditingEntry(null);
                setShowForm(true);
              }
            }}
          >
            {showForm ? "− Close form" : "+ Add new login"}
          </button>
        </div>

        {/* Add / Edit entry form */}
        {showForm && (
          <div className="vault-form-panel">
            <div className="form-panel-heading">
              <h3>
                {editingEntry
                  ? "✏️ Edit your treasure"
                  : "🎀 Add a new treasure"}
              </h3>
              <button
                type="button"
                className="close-form-button"
                onClick={handleCloseForm}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <EntryForm onSaved={handleSaved} editingEntry={editingEntry} />
          </div>
        )}

        {/* Search */}
        <div className="vault-search">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search by website, link or username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Entry list */}
        <div className="vault-entry-list">
          {loading ? (
            <div className="vault-empty-state">
              <div className="empty-icon">🎀</div>
              <h3>Opening your treasure box...</h3>
              <p>Your saved logins are on their way.</p>
            </div>
          ) : error ? (
            <div className="vault-empty-state">
              <div className="empty-icon">♡</div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button type="button" onClick={reload}>
                Try again
              </button>
            </div>
          ) : entries.length === 0 ? (
            <div className="vault-empty-state">
              <div className="empty-icon">🧰</div>
              <h3>
                {query ? "No treasures found!" : "Your vault is waiting!"}
              </h3>
              <p>
                {query
                  ? "Try another search term."
                  : "Add your first login and keep it safe with Lockr."}
              </p>

              {!query && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingEntry(null);
                    setShowForm(true);
                  }}
                >
                  + Add your first login
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="entry-count">
                Showing {entries.length}{" "}
                {entries.length === 1 ? "login" : "logins"}
              </div>

              <div className="vault-entry-grid">
                {entries.map((entry) => (
                  <EntryCard
                    key={entry._id}
                    entry={entry}
                    onDeleted={reload}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="vault-footer">
        <span>Made with ♡ by Lockr</span>
        <span>Keep your keys safe, always. ✨</span>
      </footer>
    </main>
  );
}