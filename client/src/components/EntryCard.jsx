import { useEffect, useRef, useState } from "react";
import api from "../api";

export default function EntryCard({ entry, onDeleted, onEdit }) {
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [usernameCopied, setUsernameCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const revealTimer = useRef(null);
  const copiedTimer = useRef(null);
  const clipboardTimer = useRef(null);
  const usernameTimer = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(revealTimer.current);
      clearTimeout(copiedTimer.current);
      clearTimeout(clipboardTimer.current);
      clearTimeout(usernameTimer.current);
    };
  }, []);

  const getPassword = async () => {
    const { data } = await api.get(`/entries/${entry._id}/reveal`);
    return data.password;
  };

  // Reveal password for 10 seconds
  const reveal = async () => {
    if (password) {
      clearTimeout(revealTimer.current);
      setPassword("");
      return;
    }

    try {
      const pw = await getPassword();
      setPassword(pw);

      clearTimeout(revealTimer.current);
      revealTimer.current = setTimeout(() => {
        setPassword("");
      }, 10000);
    } catch (err) {
      console.error(err);
    }
  };

  // Copy password and attempt clipboard clearing after 15 seconds
  const copy = async () => {
    try {
      const pw = await getPassword();
      await navigator.clipboard.writeText(pw);

      setCopied(true);

      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => {
        setCopied(false);
      }, 2000);

      clearTimeout(clipboardTimer.current);
      clipboardTimer.current = setTimeout(async () => {
        try {
          const current = await navigator.clipboard.readText();
          if (current === pw) {
            await navigator.clipboard.writeText("");
          }
        } catch (err) {
          console.error("Clipboard could not be cleared:", err);
        }
      }, 15000);
    } catch (err) {
      console.error("Could not copy password:", err);
    }
  };

  // Copy username
  const copyUsername = async () => {
    try {
      await navigator.clipboard.writeText(entry.username);
      setUsernameCopied(true);

      clearTimeout(usernameTimer.current);
      usernameTimer.current = setTimeout(() => {
        setUsernameCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Could not copy username:", err);
    }
  };

  // Delete entry
  const remove = async () => {
    if (!window.confirm(`Are you sure you want to delete ${entry.siteName}?`)) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete(`/entries/${entry._id}`);
      onDeleted();
    } catch (err) {
      console.error("Could not delete entry:", err);
      setDeleting(false);
    }
  };

  return (
    <article className="entry">
      <div className="entry-top">
        <div className="entry-site-icon">
          {entry.siteName?.charAt(0)?.toUpperCase() || "♡"}
        </div>

        <div className="entry-title">
          <h3>{entry.siteName}</h3>
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="entry-url"
          >
            {entry.url}
          </a>
        </div>

        <span className="entry-bow" aria-hidden="true">
          🎀
        </span>
      </div>

      <div className="entry-divider" />

      <div className="entry-detail">
        <span className="entry-label">USERNAME</span>

        <div className="entry-value-row">
          <span className="entry-value">{entry.username}</span>

          <button
            type="button"
            className="entry-icon-button"
            onClick={copyUsername}
            aria-label="Copy username"
            title="Copy username"
          >
            {usernameCopied ? "✓" : "▢"}
          </button>
        </div>
      </div>

      <div className="entry-detail">
        <span className="entry-label">PASSWORD</span>

        <div className="entry-value-row">
          <span className="entry-value password-value">
            {password || "••••••••••••"}
          </span>

          <button
            type="button"
            className={`entry-icon-button ${password ? "eye-visible" : ""}`}
            onClick={reveal}
            aria-label={password ? "Hide password" : "Reveal password"}
            title={password ? "Hide password" : "Reveal password"}
          >
            {password ? (
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

      <div className="entry-actions">
        <button
          type="button"
          className={`entry-copy-button ${copied ? "copied" : ""}`}
          onClick={copy}
        >
          {copied ? "✓ Copied!" : "♡ Copy password"}
        </button>

        <button
          type="button"
          className="entry-edit-button"
          onClick={() => onEdit(entry)}
        >
          Edit
        </button>

        <button
          type="button"
          className="entry-delete-button"
          onClick={remove}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {password && (
        <p className="entry-security-note">
          ♡ Password will hide automatically in 10 seconds
        </p>
      )}
    </article>
  );
}