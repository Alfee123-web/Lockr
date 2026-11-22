import { useEffect, useState } from "react";
import api from "../api";
import PasswordGenerator from "./PasswordGenerator";

const empty = {
  siteName: "",
  url: "",
  username: "",
  password: "",
  category: "Other",
  passwordRules: "",
};

const categories = [
  "Social",
  "Banking",
  "Work",
  "Entertainment",
  "Shopping",
  "Other",
];

export default function EntryForm({ onSaved, editingEntry = null }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const isEditing = Boolean(editingEntry);

  useEffect(() => {
    if (editingEntry) {
      setForm({
        siteName: editingEntry.siteName || "",
        url: editingEntry.url || "",
        username: editingEntry.username || "",
        password: editingEntry.password || "",
        category: editingEntry.category || "Other",
        passwordRules: editingEntry.passwordRules || "",
      });
      setShow(false);
      setError("");
    } else {
      setForm({ ...empty });
    }
  }, [editingEntry]);

  const change = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const usePassword = (password, passwordRules) => {
    setForm((prev) => ({
      ...prev,
      password,
      passwordRules,
    }));

    setShow(true);

    const pwdInput = document.getElementById("entry-password");
    if (pwdInput) {
      pwdInput.scrollIntoView({ behavior: "smooth", block: "center" });
      pwdInput.focus();
    }
  };

  const selectCategory = (category) => {
    setForm((prev) => ({
      ...prev,
      category,
    }));

    setCategoryOpen(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isEditing) {
        await api.put(`/entries/${editingEntry._id}`, form);
      } else {
        await api.post("/entries", form);
      }

      setForm({ ...empty });
      setShow(false);
      setCategoryOpen(false);

      onSaved();
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          (isEditing ? "Could not update entry" : "Could not save entry")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="add-entry-panel">
      <div className="add-entry-heading">
        <div className="add-entry-icon">{isEditing ? "✏️" : "🎀"}</div>

        <div>
          <h3>{isEditing ? "Edit vault entry" : "Add to your vault"}</h3>
          <p>
            {isEditing
              ? "Update your login details and save your changes."
              : "Keep your login details safe and organised."}
          </p>
        </div>
      </div>

      <form className="entry-form" onSubmit={submit}>
        <div className="form-field">
          <label htmlFor="siteName">Website or application</label>
          <input
            id="siteName"
            name="siteName"
            placeholder="e.g. Netflix, Google, Instagram"
            value={form.siteName}
            onChange={change}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="url">Website link</label>
          <input
            id="url"
            name="url"
            type="text"
            placeholder="e.g. https://netflix.com"
            value={form.url}
            onChange={change}
          />
        </div>

        <div className="form-field">
          <label htmlFor="username">Username or email</label>
          <input
            id="username"
            name="username"
            placeholder="Enter your username"
            value={form.username}
            onChange={change}
          />
        </div>

        <div className="form-field">
          <label htmlFor="entry-password">Password</label>

          <div className="entry-password-wrap">
            <input
              id="entry-password"
              name="password"
              type={show ? "text" : "password"}
              placeholder="Enter or generate a password"
              value={form.password}
              onChange={change}
              required
            />

            <button
              type="button"
              className={`password-eye ${show ? "eye-active" : ""}`}
              onClick={() => setShow((prev) => !prev)}
              aria-label={show ? "Hide password" : "Show password"}
              title={show ? "Hide password" : "Show password"}
            >
              {show ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                  <path d="m3 3 18 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="form-field">
          <label id="category-label">Category</label>

          <div
            className="custom-category"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setCategoryOpen(false);
              }
            }}
          >
            <button
              type="button"
              id="category"
              className={`category-trigger ${
                categoryOpen ? "category-active" : ""
              }`}
              aria-labelledby="category-label"
              aria-haspopup="listbox"
              aria-expanded={categoryOpen}
              onClick={() => setCategoryOpen((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setCategoryOpen(false);
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setCategoryOpen(true);
                }
              }}
            >
              <span>{form.category}</span>
              <span
                className={`category-chevron ${
                  categoryOpen ? "chevron-up" : ""
                }`}
              >
                ⌄
              </span>
            </button>

            {categoryOpen && (
              <div
                className="category-options"
                role="listbox"
                aria-labelledby="category-label"
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    role="option"
                    aria-selected={form.category === category}
                    className={`category-option ${
                      form.category === category ? "selected-category" : ""
                    }`}
                    onClick={() => selectCategory(category)}
                  >
                    <span>{category}</span>
                    {form.category === category && <span>♡</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="generator-section">
          <div className="generator-heading">
            <span>✨</span>
            <span>Need a stronger password?</span>
          </div>

          <PasswordGenerator onUse={usePassword} />
        </div>

        {error && (
          <p className="error auth-error" role="alert">
            ♡ {error}
          </p>
        )}

        <button
          type="submit"
          className="save-entry-button"
          disabled={loading}
        >
          {loading
            ? isEditing
              ? "Updating your password..."
              : "Saving your password..."
            : isEditing
            ? "♡ Save changes"
            : "♡ Save to Lockr"}
        </button>

        <p className="form-privacy-note">
          🔒 Your password is protected by Lockr encryption.
        </p>
      </form>
    </section>
  );
}