import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/staff/dashboard", label: "Dashboard" },
  { to: "/staff/history", label: "History" },
];

export default function DashboardLayout({ counterName, statusLabel = "Active", children }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("staffToken");
    navigate("/staff/login");
  }

  return (
    <div className="min-h-screen grid grid-cols-[200px_1fr] bg-surface">
      <aside className="bg-ink text-white flex flex-col p-4 gap-1">
        <p className="text-sm font-semibold px-2 mb-4">🏦 SecureBank</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive ? "bg-primary text-white" : "text-gray-400 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-400 hover:text-white text-left"
        >
          Logout
        </button>
      </aside>

      <div className="flex flex-col">
        <header className="bg-white border-b border-line px-6 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">{counterName}</p>
          </div>
          <span className="text-xs font-medium bg-success-light text-success px-3 py-1 rounded-full">
            {statusLabel}
          </span>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
