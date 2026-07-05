
export default function SplitScreenLayout({ eyebrow, brandTint = "primary", children }) {
  const gradient =
    brandTint === "success"
      ? "from-success to-emerald-700"
      : "from-primary to-blue-800";

  return (
    <div className="min-h-screen grid md:grid-cols-[38%_62%]">
      <div className={`hidden md:flex flex-col items-center justify-center gap-3 bg-gradient-to-br ${gradient} px-10`}>
        <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center text-white text-lg">
          🏦
        </div>
        <p className="text-white font-semibold text-base">SecureBank</p>
        {eyebrow && <p className="text-white/80 text-xs text-center">{eyebrow}</p>}
      </div>

      <div className="flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
