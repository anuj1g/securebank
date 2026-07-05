export default function ServiceCard({ name, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 h-11 rounded-lg px-3 text-sm text-left transition-colors ${
        selected ? "border-2 border-primary bg-primary-light text-ink font-medium" : "border border-line text-ink hover:bg-surface"
      }`}
    >
      <span>{name}</span>
    </button>
  );
}
