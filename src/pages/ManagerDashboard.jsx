import { useEffect, useState } from "react";
import StatCard from "../components/StatCard.jsx";
import { getTeamLeaves } from "../api/leaves.js";
import { getSummary } from "../api/analytics.js";
import { formatDate } from "../utils/date.js";

export default function ManagerDashboard() {
  const [summary, setSummary] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [historyLeaves, setHistoryLeaves] = useState([]);

  useEffect(() => {
    Promise.all([
      getSummary(),
      getTeamLeaves({ status: "PENDING" }),
      getTeamLeaves(),
    ]).then(([summaryData, pendingData, allData]) => {
      setSummary(summaryData);
      setPendingLeaves(pendingData);
      const history = (allData || [])
        .filter((leave) => leave.status !== "PENDING")
        .sort((a, b) => {
          const left = a.appliedAt || a.startDate || "";
          const right = b.appliedAt || b.startDate || "";
          return right.localeCompare(left);
        })
        .slice(0, 6);
      setHistoryLeaves(history);
    });
  }, []);

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-3 gap-4">
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
        <h3 className="text-lg font-semibold mb-4">Pending team leaves</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="pb-3">Employee</th>
                <th className="pb-3">Dates</th>
                <th className="pb-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {pendingLeaves.map((leave) => (
                <tr key={leave.id} className="border-t border-slate-100">
                  <td className="py-3 font-semibold">{leave.employeeName}</td>
                  <td className="py-3 text-slate-600">
                    {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                  </td>
                  <td className="py-3 text-slate-600">{leave.leaveType}</td>
                </tr>
              ))}
              {pendingLeaves.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-slate-500">
                    No pending leaves.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent decisions</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="pb-3">Employee</th>
                <th className="pb-3">Dates</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {historyLeaves.map((leave) => (
                <tr key={leave.id} className="border-t border-slate-100">
                  <td className="py-3 font-semibold">{leave.employeeName}</td>
                  <td className="py-3 text-slate-600">
                    {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                  </td>
                  <td className="py-3 text-slate-600">{leave.leaveType}</td>
                  <td className="py-3">
                    <span className="tag bg-slate-100 text-slate-700">
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
              {historyLeaves.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-500">
                    No approved or rejected leaves yet.
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
