import { Link } from "react-router-dom";

export default function Sidebar({ items, user, onLogout, activePath }) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:min-h-screen bg-white/70 border-r border-white/60 p-6">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-700">
          Portfolio
        </p>
        <h2 className="text-2xl font-semibold">Leave Desk</h2>
        <p className="text-sm text-slate-500">{user?.role}</p>
      </div>
      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
              activePath === item.to
                ? "bg-amber-500/15 text-amber-800"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        onClick={onLogout}
        className="mt-6 rounded-xl border border-amber-400/50 px-4 py-2 text-sm font-semibold text-amber-700"
      >
        Log out
      </button>
    </aside>
  );
}
