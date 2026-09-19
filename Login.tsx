import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      setLoading(true);
      const data = await login(username, password);
      localStorage.setItem("token", data.token || "demo-token");
      localStorage.setItem("role", data.role || "User");
      navigate("/employees");
    } catch {
      setError("Login failed. Check your credentials or API URL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Employee Management</h1>
        <p className="muted">Sign in to continue</p>

        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

        {error && <div className="error">{error}</div>}

        <button className="primary full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}