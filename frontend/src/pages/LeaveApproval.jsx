import { useEffect, useState } from "react";
import { decideLeave, getAllLeaves, getTeamLeaves } from "../api/leaves.js";
import { formatDate } from "../utils/date.js";
import { useAuth } from "../hooks/useAuth.jsx";

export default function LeaveApproval() {

  const { user } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [actionState, setActionState] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");

  const isAdmin = user?.role === "ADMIN";

  const loadLeaves = async (status = statusFilter) => {

    const params = {
      status: status === "ALL" ? "" : status,
    };

    const data = isAdmin
      ? await getAllLeaves(params)
      : await getTeamLeaves(params);

    setLeaves(data);
  };

  useEffect(() => {
    loadLeaves();
  }, [statusFilter]);

  const handleDecision = async (id, approved) => {

    setActionState("Updating...");

    await decideLeave(
      id,
      approved,
      approved ? "Approved" : "Rejected",
      isAdmin,
    );

    await loadLeaves();

    setActionState("");
  };

  return (
    <div className="card p-6">

      <div className="flex items-center justify-between mb-4">

        <h3 className="text-lg font-semibold">
          Approve leaves
        </h3>

        <div className="flex items-center gap-3">

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ALL">All</option>
          </select>

          <span className="text-sm text-slate-500">
            {actionState}
          </span>

        </div>
      </div>

      <div className="overflow-auto">

        <table className="w-full text-sm">

          <thead className="text-left text-slate-500">
            <tr>
              <th className="pb-3">Employee</th>
              <th className="pb-3">Dates</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>

          <tbody>

            {leaves.map((leave) => (

              <tr key={leave.id} className="border-t border-slate-100">

                <td className="py-3 font-semibold">
                  {leave.employeeName}
                </td>

                <td className="py-3 text-slate-600">
                  {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                </td>

                <td className="py-3 text-slate-600">
                  {leave.leaveType}
                </td>

                <td className="py-3">
                  <span className="tag bg-slate-100 text-slate-700">
                    {leave.status}
                  </span>
                </td>

                <td className="py-3 flex gap-2">

                  {leave.status === "PENDING" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDecision(leave.id, true)}
                        className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDecision(leave.id, false)}
                        className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500">
                      No action
                    </span>
                  )}

                </td>
              </tr>

            ))}

            {leaves.length === 0 && (
              <tr>
                <td colSpan="5" className="py-6 text-center text-slate-500">
                  No leaves found for this filter.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>
    </div>
  );
}
