import { useEffect, useState } from "react";
import StatCard from "../components/StatCard.jsx";
import { getSummary } from "../api/analytics.js";
import { getAllLeaves } from "../api/leaves.js";
import { formatDate } from "../utils/date.js";
import { getRegistrationMeta } from "../api/meta.js";
import { getLeavePredictions } from "../api/admin.js";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    department: "",
    from: "",
    to: "",
  });
  const [departments, setDepartments] = useState([]);
  const [predictions, setPredictions] = useState([]);

  const loadLeaves = async (params = filters) => {
    const data = await getAllLeaves(params);
    setLeaves(data);
  };

  useEffect(() => {
    getSummary().then(setSummary);
    loadLeaves();
    getRegistrationMeta()
      .then((meta) => setDepartments(meta.departments || []))
      .catch(() => setDepartments([]));
    getLeavePredictions()
      .then((data) => setPredictions(data || []))
      .catch(console.error);
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    loadLeaves();
  };

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Total" value={summary ? summary.total : "--"} />
        <StatCard
          label="Pending"
          value={summary ? summary.pending : "--"}
          tone="warn"
        />
        <StatCard
          label="Approved"
          value={summary ? summary.approved : "--"}
          tone="good"
        />
        <StatCard label="Rejected" value={summary ? summary.rejected : "--"} />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">All leave requests</h3>
          <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-2">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm"
            >
              <option value="">All status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm"
            >
              <option value="">All departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="from"
              value={filters.from}
              onChange={handleFilterChange}
              className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm"
            />
            <input
              type="date"
              name="to"
              value={filters.to}
              onChange={handleFilterChange}
              className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Filter
            </button>
          </form>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="pb-3">Employee</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Dates</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id} className="border-t border-slate-100">
                  <td className="py-3 font-semibold">{leave.employeeName}</td>
                  <td className="py-3 text-slate-600">
                    {leave.department || "-"}
                  </td>
                  <td className="py-3 text-slate-600">
                    {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                  </td>
                  <td className="py-3">
                    <span className="tag bg-slate-100 text-slate-700">
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-500">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <StatCard
          label="High-Risk Employees"
          value={predictions.filter((p) => p.prediction === 1).length}
          tone="warn"
        />
        <StatCard
          label="Low-Risk Employees"
          value={predictions.filter((p) => p.prediction === 0).length}
          tone="good"
        />
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Leave Prediction Insights</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="pb-3">Employee</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Risk Level</th>
                <th className="pb-3">Probability (High Risk)</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p) => (
                <tr key={p.userId} className="border-t border-slate-100">
                  <td className="py-3 font-semibold">{p.name}</td>
                  <td className="py-3 text-slate-600">{p.department || "-"}</td>
                  <td className="py-3">
                    <span
                      className={`tag ${
                        p.prediction === 1
                          ? "bg-red-100 text-red-700"
                          : p.prediction === 0
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {p.risk}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600">
                    {p.probability != null ? `${(p.probability * 100).toFixed(1)}%` : "-"}
                  </td>
                </tr>
              ))}
              {predictions.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-500">
                    Loading predictions....
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
