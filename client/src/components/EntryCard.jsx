import { useState } from "react";
import api from "../api";

export default function EntryCard({ entry, onDeleted }) {
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const getPassword = async () => {
    const { data } = await api.get(`/entries/${entry._id}/reveal`);
    return data.password;
  };

  // Show the password for 10 seconds, then hide it again
  const reveal = async () => {
    if (password) return setPassword("");
    try {
      setPassword(await getPassword());
      setTimeout(() => setPassword(""), 10000);
    } catch (err) {
      console.error(err);
    }
  };

  // Copy the password, then clear the clipboard after 15 seconds
  const copy = async () => {
    try {
      const pw = await getPassword();
      await navigator.clipboard.writeText(pw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => navigator.clipboard.writeText(""), 15000);
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${entry.siteName}?`)) return;
    await api.delete(`/entries/${entry._id}`);
    onDeleted();
  };

  return (
    <div className="entry">
      <strong>{entry.siteName}</strong>
      <div>{entry.url}</div>
      <div>{entry.username}</div>
      <div className="pw">{password ? password : "••••••••"}</div>
      <div className="actions">
        <button onClick={reveal}>{password ? "Hide" : "Reveal"}</button>
        <button onClick={copy}>{copied ? "Copied!" : "Copy"}</button>
        <button onClick={remove}>Delete</button>
      </div>
    </div>
  );
}