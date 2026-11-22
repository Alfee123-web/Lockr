export default function Vault() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="vault">
      <h1>Your Vault</h1>
      <p>Entries coming soon...</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}