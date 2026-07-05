import { useNavigate } from "react-router-dom";
import SplitScreenLayout from "../../layouts/SplitScreenLayout";

export default function Home() {
  const navigate = useNavigate();

  return (
    <SplitScreenLayout eyebrow="Skip the line. Join virtually.">
      <div className="text-center">
        <p className="text-lg font-semibold text-ink mb-1">Welcome to CP Branch</p>
        <p className="text-sm text-ink-muted mb-6">Join the queue without waiting in line</p>
        <button className="btn-primary w-full" onClick={() => navigate("/select-service")}>
          Join queue
        </button>
      </div>
    </SplitScreenLayout>
  );
}
