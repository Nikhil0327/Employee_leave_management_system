import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { getRegistrationMeta } from "../api/meta.js";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    managerId: "",
  });
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    getRegistrationMeta()
      .then((meta) => {
        setDepartments(meta.departments || []);
        setManagers(meta.managers || []);
      })
      .catch(() => {
        setDepartments([]);
        setManagers([]);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/employee");
    } catch {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-lg p-8">
        <h1 className="text-3xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Start managing your leaves in minutes.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="text-sm font-semibold text-slate-600">
            Full name
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-2"
            />
          </label>
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
          <label className="text-sm font-semibold text-slate-600">
            Department
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-2"
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-600">
            Manager (optional)
            <select
              name="managerId"
              value={form.managerId}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-2"
            >
              <option value="">No manager</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.fullName} · {manager.department || "Department"}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-white shadow-glow"
          >
            Create account
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          Already have an account?{" "}
          <Link className="text-amber-700 font-semibold" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
