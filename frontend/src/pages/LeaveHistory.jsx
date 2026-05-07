import { useEffect, useState } from "react";
import { getMyLeaves } from "../api/leaves.js";
import { formatDate } from "../utils/date.js";

export default function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    getMyLeaves().then(setLeaves);
  }, []);

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Leave history</h3>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="pb-3">Type</th>
              <th className="pb-3">Dates</th>
              <th className="pb-3">Days</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id} className="border-t border-slate-100">
                <td className="py-3 font-semibold">{leave.leaveType}</td>
                <td className="py-3 text-slate-600">
                  {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                </td>
                <td className="py-3 text-slate-600">{leave.totalDays}</td>
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
                  No leave history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
