import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import Sidebar from "./Sidebar.jsx";

const navItems = {

  EMPLOYEE: [
    { label: "Dashboard", to: "/employee" },
    { label: "History", to: "/employee/history" },
  ],

  MANAGER: [
    { label: "Dashboard", to: "/manager" },
    { label: "Approvals", to: "/manager/approvals" },
  ],

  ADMIN: [
    { label: "Dashboard", to: "/admin" },

    // NEW
    { label: "Approvals", to: "/admin/approvals" },

    { label: "Policy", to: "/admin/policy" },

    { label: "Reports", to: "/admin/reports" },
  ],

};

export default function Layout() {

  const { user, logout } = useAuth();

  const location = useLocation();

  const items = navItems[user?.role] || [];

  return (

    <div className="min-h-screen flex">

      <Sidebar
        items={items}
        user={user}
        onLogout={logout}
        activePath={location.pathname}
      />

      <div className="flex-1 p-6 lg:p-10">

        <div className="mb-6 flex items-center justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.25em] text-amber-700">
              Leave System
            </p>

            <h1 className="text-3xl font-semibold">
              Welcome, {user?.fullName}
            </h1>

          </div>

          <Link
            to="/login"
            onClick={logout}
            className="rounded-full border border-amber-500/40 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-500/10"
          >
            Sign out
          </Link>

        </div>

        <div className="page">
          <Outlet />
        </div>

      </div>

    </div>
  );
}
