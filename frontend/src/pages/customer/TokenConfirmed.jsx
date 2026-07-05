import { useLocation, useNavigate } from "react-router-dom";
import SplitScreenLayout from "../../layouts/SplitScreenLayout";

export default function TokenConfirmed() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const entry = state?.entry;

  if (!entry) {
    return (
      <SplitScreenLayout>
        <p className="text-sm text-ink-muted text-center">
          No token found. Please <button className="text-primary underline" onClick={() => navigate("/")}>start again</button>.
        </p>
      </SplitScreenLayout>
    );
  }

  return (
    <SplitScreenLayout eyebrow="Step 3 of 3 — You're all set">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center mx-auto mb-3">
          <span className="text-success text-xl">✓</span>
        </div>
        <p className="text-xs text-ink-muted mb-1">Your token number</p>
        <p className="text-4xl font-semibold text-primary mb-1">{entry.tokenNumber}</p>
        <p className="text-xs text-ink-muted mb-4">Account opening • CP branch</p>

        <div className="flex justify-center gap-6 bg-surface rounded-xl px-6 py-3 mb-5">
          <div className="text-center">
            <p className="text-[10px] text-ink-muted">People ahead</p>
            <p className="text-base font-semibold text-ink">—</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-ink-muted">Est. wait</p>
            <p className="text-base font-semibold text-ink">—</p>
          </div>
        </div>

        <button
          className="btn-primary w-full"
          onClick={() => navigate("/live-waiting", { state: { entry } })}
        >
          View live status
        </button>
      </div>
    </SplitScreenLayout>
  );
}
