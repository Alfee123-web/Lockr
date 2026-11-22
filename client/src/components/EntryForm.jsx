import { useState } from "react";
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

const categories = ["Social", "Banking", "Work", "Entertainment", "Shopping", "Other"];

export default function EntryForm({ onSaved }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Called when you click "Use this password" in the generator
  const usePassword = (password, passwordRules) => {
    setForm({ ...form, password, passwordRules });
    setShow(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/entries", form);
      setForm(empty);
      setShow(false);
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

      <div className="pw-row">
        <input
          name="password"
          type={show ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={change}
          required
        />
        <button type="button" className="ghost" onClick={() => setShow(!show)}>
          {show ? "Hide" : "Show"}
        </button>
      </div>

      <PasswordGenerator onUse={usePassword} />

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