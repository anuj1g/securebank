import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { api } from "../../api/client";

export default function History() {
  const [counter, setCounter] = useState(null);
  const [history, setHistory] = useState({ servedCount: 0, entries: [] });

  useEffect(() => {
    const staffMongoId = localStorage.getItem("staffMongoId");
    if (!staffMongoId) return;
    api.getMyCounter(staffMongoId).then(setCounter).catch(() => {});
  }, []);

  useEffect(() => {
    if (!counter) return;
    api.getHistory(counter.category._id).then(setHistory).catch(() => {});
  }, [counter]);

  return (
    <DashboardLayout counterName={counter ? `${counter.name} — ${counter.category.name}` : "Loading counter…"}>
      <p className="text-sm font-semibold text-ink mb-1">Served today</p>
      <p className="text-2xl font-semibold text-ink mb-4">
        {history.servedCount} <span className="text-xs font-normal text-ink-muted">customers</span>
      </p>

      <div className="bg-white rounded-lg border border-line overflow-hidden">
        {history.entries.length === 0 && (
          <p className="text-sm text-ink-muted px-4 py-6 text-center">Nothing served yet today.</p>
        )}
        {history.entries.map((entry) => (
          <div key={entry._id} className="flex justify-between px-4 py-2.5 text-sm border-t border-gray-100 first:border-t-0">
            <span className={entry.status === "no-show" ? "text-gray-400" : "text-ink"}>
              {entry.tokenNumber} • {entry.customerName}
              {entry.status === "no-show" && " (no-show)"}
            </span>
            <span className="text-ink-muted">
              {new Date(entry.servedAt || entry.joinedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
