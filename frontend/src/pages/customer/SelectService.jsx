import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SplitScreenLayout from "../../layouts/SplitScreenLayout";
import ServiceCard from "../../components/ServiceCard";
import { api } from "../../api/client";

export default function SelectService() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleContinue() {
    if (!selectedId) return;
    navigate("/your-details", { state: { categoryId: selectedId } });
  }

  return (
    <SplitScreenLayout eyebrow="Step 1 of 3 — Choose what you need help with">
      <p className="text-base font-semibold text-ink mb-4">Select a service</p>

      {loading && <p className="text-sm text-ink-muted">Loading services…</p>}

      <div className="grid grid-cols-1 gap-2.5 mb-6">
        {categories.map((c) => (
          <ServiceCard key={c._id} name={c.name} selected={selectedId === c._id} onClick={() => setSelectedId(c._id)} />
        ))}
      </div>

      <button className="btn-primary" disabled={!selectedId} onClick={handleContinue}>
        Continue
      </button>
    </SplitScreenLayout>
  );
}
