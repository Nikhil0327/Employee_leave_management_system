import { useEffect, useState } from "react";
import { getPolicy, updatePolicy } from "../api/admin.js";

export default function PolicySettings() {
  const [policy, setPolicy] = useState({ maxLeavesPerYear: 0, typeLimits: {} });
  const [status, setStatus] = useState("");

  useEffect(() => {
    getPolicy().then(setPolicy);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPolicy((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleLimitChange = (event) => {
    const { name, value } = event.target;
    setPolicy((prev) => ({
      ...prev,
      typeLimits: { ...prev.typeLimits, [name]: Number(value) },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Saving...");
    await updatePolicy(policy);
    setStatus("Policy updated.");
  };

  return (
    <div className="card p-6 max-w-2xl">
      <h3 className="text-lg font-semibold mb-2">Leave policy</h3>
      <p className="text-sm text-slate-500 mb-6">
        Define yearly limits and leave type caps.
      </p>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="text-sm font-semibold text-slate-600">
          Max leaves per year
          <input
            type="number"
            name="maxLeavesPerYear"
            value={policy.maxLeavesPerYear}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-2"
          />
        </label>
        {Object.keys(policy.typeLimits || {}).map((key) => (
          <label key={key} className="text-sm font-semibold text-slate-600">
            {key} limit
            <input
              type="number"
              name={key}
              value={policy.typeLimits[key]}
              onChange={handleLimitChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-2"
            />
          </label>
        ))}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">{status}</p>
          <button
            type="submit"
            className="rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-white"
          >
            Save policy
          </button>
        </div>
      </form>
    </div>
  );
}
