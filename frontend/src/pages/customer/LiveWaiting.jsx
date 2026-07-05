import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SplitScreenLayout from "../../layouts/SplitScreenLayout";
import QueueAvatarRow from "../../components/QueueAvatarRow";
import { socket } from "../../api/socket";
import { api } from "../../api/client";

export default function LiveWaiting() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const entry = state?.entry;
  const [queue, setQueue] = useState([]);

  const mine = queue.find((q) => String(q.id) === String(entry?._id));

  useEffect(() => {
    if (!entry) return;

    const categoryId = entry.category;

    
    api.getQueueByCategory(categoryId).then(setQueue).catch(() => {});

    socket.emit("joinCategoryRoom", categoryId);
    socket.on("queueUpdated", setQueue);

    return () => {
      socket.emit("leaveCategoryRoom", categoryId);
      socket.off("queueUpdated", setQueue);
    };
  }, [entry]);

  // The moment staff calls this token, redirect to the "Your Turn" screen.
  useEffect(() => {
    if (mine?.status === "called") {
      navigate("/your-turn", { state: { entry } });
    }
  }, [mine, navigate, entry]);

  if (!entry) {
    return (
      <SplitScreenLayout>
        <p className="text-sm text-ink-muted text-center">No active token found.</p>
      </SplitScreenLayout>
    );
  }

  return (
    <SplitScreenLayout eyebrow="Live • updates in real time">
      <div className="text-center">
        <p className="text-xs text-ink-muted mb-2">Your token • {entry.tokenNumber}</p>

        <div className="bg-surface rounded-xl px-8 py-4 inline-block mb-5">
          <p className="text-2xl font-semibold text-primary">
            {mine ? `${mine.estimatedWaitMinutes} min` : "—"}
          </p>
          <p className="text-[10px] text-ink-muted">estimated remaining</p>
        </div>

        <p className="text-xs text-ink-muted mb-3">Queue ahead of you</p>
        <QueueAvatarRow people={queue} myEntryId={entry._id} />

        <p className="text-[11px] text-primary font-medium mt-4">You're highlighted in blue</p>
      </div>
    </SplitScreenLayout>
  );
}
