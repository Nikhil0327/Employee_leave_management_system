import { useState } from "react";
import { downloadMonthlyCsv, getMonthlyReport } from "../api/reports.js";
import { formatDate } from "../utils/date.js";

export default function Reports() {
  const [monthValue, setMonthValue] = useState("");
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("");

  const handleFetch = async (event) => {
    event.preventDefault();
    if (!monthValue) {
      return;
    }
    const [year, month] = monthValue.split("-").map(Number);
    setStatus("Loading...");
    const data = await getMonthlyReport(year, month);
    setRows(data);
    setStatus("");
  };

  const handleDownload = async () => {
    if (!monthValue) {
      return;
    }
    const [year, month] = monthValue.split("-").map(Number);
    const blob = await downloadMonthlyCsv(year, month);
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `leave-report-${year}-${month}.csv`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6">
      <form
        onSubmit={handleFetch}
        className="card p-6 flex flex-wrap gap-4 items-center"
      >
        <div>
          <label className="text-sm font-semibold text-slate-600">
            Month
            <input
              type="month"
              value={monthValue}
              onChange={(event) => setMonthValue(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-2"
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-white"
        >
          Generate
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="mt-6 rounded-full border border-amber-400/50 px-6 py-2 text-sm font-semibold text-amber-700"
        >
          Download CSV
        </button>
        <span className="text-sm text-slate-500">{status}</span>
      </form>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly summary</h3>
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
              {rows.map((leave) => (
                <tr key={leave.id} className="border-t border-slate-100">
                  <td className="py-3 font-semibold">{leave.employeeName}</td>
                  <td className="py-3 text-slate-600">
                    {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                  </td>
                  <td className="py-3 text-slate-600">{leave.leaveType}</td>
                  <td className="py-3 text-slate-600">{leave.status}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-500">
                    No report data.
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
