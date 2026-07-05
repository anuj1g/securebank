import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SplitScreenLayout from "../../layouts/SplitScreenLayout";
import { api } from "../../api/client";

export default function YourDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!state?.categoryId) {
      setError("Please select a service first.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const entry = await api.joinQueue({
        customerName: name,
        phone,
        categoryId: state.categoryId,
      });
      navigate("/token-confirmed", { state: { entry } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SplitScreenLayout eyebrow="Step 2 of 3 — Just your name and number">
      <form onSubmit={handleSubmit}>
        <p className="text-base font-semibold text-ink mb-4">Enter your details</p>

        <label className="block text-xs text-ink-muted mb-1">Full name</label>
        <input
          className="input-field mb-3"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="block text-xs text-ink-muted mb-1">Phone number</label>
        <input
          className="input-field mb-5"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

        <button className="btn-primary w-full" disabled={submitting}>
          {submitting ? "Getting token…" : "Get token"}
        </button>
      </form>
    </SplitScreenLayout>
  );
}
