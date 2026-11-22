import { useState } from "react";
import api from "../api";

const empty = {
  siteName: "",
  url: "",
  username: "",
  password: "",
  category: "Other",
};

const categories = ["Social", "Banking", "Work", "Entertainment", "Shopping", "Other"];

export default function EntryForm({ onSaved }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/entries", form);
      setForm(empty);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.msg || "Could not save entry");
    }
  };

  return (
    <form className="entry-form" onSubmit={submit}>
      <h3>Add a new login</h3>
      <input name="siteName" placeholder="Site or company (e.g. Netflix)" value={form.siteName} onChange={change} required />
      <input name="url" placeholder="Link (e.g. netflix.com)" value={form.url} onChange={change} />
      <input name="username" placeholder="Username or email" value={form.username} onChange={change} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required />
      <select name="category" value={form.category} onChange={change}>
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      {error && <p className="error">{error}</p>}
      <button type="submit">Save to Lockr</button>
    </form>
  );
}