import { useEffect, useMemo, useState } from "react";
import CalendarView from "../components/CalendarView.jsx";
import LeaveForm from "../components/LeaveForm.jsx";
import StatCard from "../components/StatCard.jsx";
import { getBalance, getCalendar, getMyLeaves } from "../api/leaves.js";
import { formatDate } from "../utils/date.js";

export default function EmployeeDashboard() {
  const [balance, setBalance] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [calendarLeaves, setCalendarLeaves] = useState([]);

  const loadData = async () => {
    const [balanceData, leaveData] = await Promise.all([
      getBalance(),
      getMyLeaves(),
    ]);
    setBalance(balanceData);
    setLeaves(leaveData);

    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .slice(0, 10);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .slice(0, 10);
    const calendarData = await getCalendar(start, end);
    setCalendarLeaves(calendarData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingCount = useMemo(
    () => leaves.filter((leave) => leave.status === "PENDING").length,
    [leaves],
  );

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          label="Remaining"
          value={balance ? balance.remainingLeaves.toFixed(1) : "--"}
          tone="good"
        />
        <StatCard
          label="Used"
          value={balance ? balance.usedLeaves.toFixed(1) : "--"}
          tone="warn"
        />
        <StatCard label="Pending" value={pendingCount} />
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <LeaveForm onApplied={loadData} />
        <CalendarView leaves={calendarLeaves} />
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent requests</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="pb-3">Type</th>
                <th className="pb-3">Dates</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.slice(0, 5).map((leave) => (
                <tr key={leave.id} className="border-t border-slate-100">
                  <td className="py-3 font-semibold">{leave.leaveType}</td>
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
                  <td colSpan="3" className="py-6 text-center text-slate-500">
                    No leave requests yet.
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
