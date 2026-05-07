import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const redirectByRole = {
  EMPLOYEE: "/employee",
  MANAGER: "/manager",
  ADMIN: "/admin",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const fillCredentials = (email, password) => {
    setForm({ email, password });
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = await login(form);
      navigate(redirectByRole[data.role] || "/employee");
    } catch {
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to manage your leaves.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="text-sm font-semibold text-slate-600">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-2"
            />
          </label>
          <label className="text-sm font-semibold text-slate-600">
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-2"
            />
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-white shadow-glow"
          >
            Sign in
          </button>
        </form>
        <div className="mt-5 rounded-2xl border border-amber-200/60 bg-amber-50/60 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-700">
            Test accounts
          </p>
          <div className="mt-3 grid gap-2 text-sm">
            <button
              type="button"
              onClick={() =>
                fillCredentials("admin@leave.local", "Admin@12345")
              }
              className="rounded-xl border border-amber-300/70 px-3 py-2 text-left text-amber-800"
            >
              Use Admin
            </button>
            <button
              type="button"
              onClick={() =>
                fillCredentials("manager@leave.local", "Manager@12345")
              }
              className="rounded-xl border border-emerald-300/70 px-3 py-2 text-left text-emerald-800"
            >
              Use Manager
            </button>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          No account?{" "}
          <Link className="text-amber-700 font-semibold" to="/register">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
