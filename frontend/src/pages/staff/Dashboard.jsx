import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { api } from "../../api/client";
import { socket } from "../../api/socket";

export default function Dashboard() {
  const [counter, setCounter] = useState(null);
  const [queue, setQueue] = useState([]);
  const [servedToday, setServedToday] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  
  useEffect(() => {
    const staffMongoId = localStorage.getItem("staffMongoId");
    if (!staffMongoId) return;
    api.getMyCounter(staffMongoId).then(setCounter).catch(() => {});
  }, []);

  useEffect(() => {
    if (!counter) return;
    const categoryId = counter.category._id;

    api.getQueueByCategory(categoryId).then(setQueue).catch(() => {});
    api.getHistory(categoryId).then((h) => setServedToday(h.servedCount)).catch(() => {});

    socket.emit("joinCategoryRoom", categoryId);
    socket.on("queueUpdated", setQueue);

    return () => {
      socket.emit("leaveCategoryRoom", categoryId);
      socket.off("queueUpdated", setQueue);
    };
  }, [counter]);

  async function handleCallNext() {
    if (!counter) return;
    setActionLoading(true);
    try {
      await api.callNext({ categoryId: counter.category._id, counterId: counter._id });
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleServe(id) {
    await api.markServed(id);
    setServedToday((n) => n + 1);
  }

  async function handleNoShow(id) {
    await api.markNoShow(id);
  }

  const waitingCount = queue.filter((q) => q.status === "waiting").length;
  const avgWait = queue.length ? Math.round(queue.reduce((s, q) => s + q.estimatedWaitMinutes, 0) / queue.length) : 0;

  return (
    <DashboardLayout counterName={counter ? `${counter.name} — ${counter.category.name}` : "Loading counter…"}>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="In queue" value={waitingCount} />
        <StatCard label="Served today" value={servedToday} />
        <StatCard label="Avg wait" value={`${avgWait} min`} />
      </div>

      <div className="bg-white rounded-lg border border-line overflow-hidden">
        <div className="flex px-4 py-2 text-xs text-ink-muted border-b border-line">
          <span className="flex-1">Token</span>
          <span className="flex-[2]">Customer</span>
          <span className="flex-1">Wait</span>
          <span className="flex-[2] text-right">Actions</span>
        </div>

        {queue.length === 0 && <p className="text-sm text-ink-muted px-4 py-6 text-center">No one in queue right now.</p>}

        {queue.map((entry) => (
          <div
            key={entry.id}
            className={`flex items-center px-4 py-2.5 border-t border-gray-100 ${
              entry.status === "called" ? "bg-primary-light" : ""
            }`}
          >
            <span className={`flex-1 text-sm ${entry.status === "called" ? "font-semibold text-primary" : "font-medium text-ink"}`}>
              {entry.tokenNumber}
            </span>
            <span className="flex-[2] text-sm text-ink">{entry.customerName}</span>
            <span className="flex-1 text-sm text-ink-muted">{entry.estimatedWaitMinutes} min</span>
            <div className="flex-[2] flex gap-2 justify-end">
              {entry.status === "waiting" && entry === queue.find((q) => q.status === "waiting") && (
                <button onClick={handleCallNext} disabled={actionLoading} className="text-xs bg-primary text-white rounded-md px-3 h-7">
                  Call
                </button>
              )}
              {entry.status === "called" && (
                <>
                  <button onClick={() => handleServe(entry.id)} className="text-xs bg-success text-white rounded-md px-3 h-7">
                    Serve
                  </button>
                  <button onClick={() => handleNoShow(entry.id)} className="text-xs bg-white border border-line text-ink rounded-md px-3 h-7">
                    No-show
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg border border-line p-3">
      <p className="text-[11px] text-ink-muted">{label}</p>
      <p className="text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}
