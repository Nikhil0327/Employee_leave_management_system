import { useState } from "react";
import { applyLeave } from "../api/leaves.js";
import { uploadFile } from "../api/files.js";

const leaveTypes = ["CASUAL", "SICK", "PAID", "UNPAID"];

export default function LeaveForm({ onApplied }) {
  const [form, setForm] = useState({
    leaveType: "CASUAL",
    startDate: "",
    endDate: "",
    reason: "",
    halfDay: false,
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Submitting...");
    try {
      let documentPath = "";
      if (file) {
        const uploaded = await uploadFile(file);
        documentPath = uploaded.url;
      }
      const payload = { ...form, supportingDocPath: documentPath };
      await applyLeave(payload);
      setStatus("Leave request sent.");
      setForm({
        leaveType: "CASUAL",
        startDate: "",
        endDate: "",
        reason: "",
        halfDay: false,
      });
      setFile(null);
      if (onApplied) {
        onApplied();
      }
    } catch (error) {
      setStatus("Could not submit leave request.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Apply for Leave</h3>
        <span className="tag bg-amber-100 text-amber-800">New</span>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <label className="text-sm font-semibold text-slate-600">
          Leave type
          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-2"
          >
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-600">
          Start date
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-2"
          />
        </label>
        <label className="text-sm font-semibold text-slate-600">
          End date
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-2"
          />
        </label>
        <label className="text-sm font-semibold text-slate-600 flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="halfDay"
            checked={form.halfDay}
            onChange={handleChange}
          />
          Half day
        </label>
      </div>
      <label className="text-sm font-semibold text-slate-600">
        Reason
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          rows="3"
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-2"
        />
      </label>
      <label className="text-sm font-semibold text-slate-600">
        Supporting document
        <input
          type="file"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-2"
        />
      </label>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{status}</p>
        <button
          type="submit"
          className="rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-white shadow-glow"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
