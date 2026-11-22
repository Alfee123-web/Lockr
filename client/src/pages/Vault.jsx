import { useEffect, useState } from "react";
import api from "../api";
import EntryForm from "../components/EntryForm";
import EntryCard from "../components/EntryCard";

export default function Vault() {
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState("");
  const [refresh, setRefresh] = useState(0);

  const reload = () => setRefresh((r) => r + 1);

  // Fetch entries 300ms after typing stops, or after a save/delete
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get("/entries", { params: { q: query } });
        setEntries(data);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, refresh]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="vault">
      <header>
        <h1>🔐 Your Vault</h1>
        <button onClick={logout}>Log out</button>
      </header>

      <EntryForm onSaved={reload} />

      <input
        type="text"
        placeholder="Search by site, link or username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {entries.length === 0 && <p>No entries found.</p>}

      {entries.map((e) => (
        <EntryCard key={e._id} entry={e} onDeleted={reload} />
      ))}
    </div>
  );
}