import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SplitScreenLayout from "../../layouts/SplitScreenLayout";
import { api } from "../../api/client";

export default function Login() {
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const data = await api.staffLogin({ staffId, password });
      localStorage.setItem("staffToken", data.token);
      localStorage.setItem("staffName", data.staff.name);
      localStorage.setItem("staffMongoId", data.staff.id);
      navigate("/staff/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SplitScreenLayout eyebrow="Counter access portal">
      <form onSubmit={handleSubmit} className="max-w-[220px] mx-auto">
        <label className="block text-xs text-ink-muted mb-1">Staff ID</label>
        <input
          className="input-field mb-3"
          placeholder="STF-102"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          required
        />

        <label className="block text-xs text-ink-muted mb-1">Password</label>
        <input
          type="password"
          className="input-field mb-4"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

        <button className="btn-primary w-full" disabled={submitting}>
          {submitting ? "Logging in…" : "Login"}
        </button>
      </form>
    </SplitScreenLayout>
  );
}
