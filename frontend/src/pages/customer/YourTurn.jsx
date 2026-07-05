import { useLocation, useNavigate } from "react-router-dom";
import SplitScreenLayout from "../../layouts/SplitScreenLayout";

export default function YourTurn() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const entry = state?.entry;

  return (
    <SplitScreenLayout eyebrow="Right on time" brandTint="success">
      <div className="text-center bg-success-light -mx-6 md:mx-0 px-6 py-10 rounded-xl">
        <p className="text-lg font-semibold text-ink mb-1">It's your turn!</p>
        <p className="text-sm text-ink-muted mb-5">
          Please proceed to <span className="font-semibold">Counter 2</span>
        </p>
        <button
          className="bg-success text-white rounded-lg font-medium text-sm px-6 h-11 hover:bg-emerald-700 transition-colors"
          onClick={() => navigate("/")}
        >
          Got it
        </button>
      </div>
    </SplitScreenLayout>
  );
}
