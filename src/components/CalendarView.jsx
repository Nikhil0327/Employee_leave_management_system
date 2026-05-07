import { useMemo, useState } from "react";
import { expandDateRange, getMonthMatrix } from "../utils/date.js";

export default function CalendarView({ leaves }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const approvedDates = useMemo(() => {
    const dates = new Set();
    leaves.forEach((leave) => {
      if (!leave.startDate || !leave.endDate) {
        return;
      }
      expandDateRange(leave.startDate, leave.endDate).forEach((date) => {
        dates.add(date.toDateString());
      });
    });
    return dates;
  }, [leaves]);

  const weeks = getMonthMatrix(year, month);

  const previousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const monthLabel = new Date(year, month).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Leave Calendar</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={previousMonth}
            className="rounded-full border px-3 py-1"
          >
            Prev
          </button>
          <span className="text-sm font-semibold">{monthLabel}</span>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-full border px-3 py-1"
          >
            Next
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-xs text-slate-500">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {weeks.flat().map((date, index) => {
          if (!date) {
            return (
              <div
                key={`empty-${index}`}
                className="h-10 rounded-lg bg-white/40"
              />
            );
          }
          const isApproved = approvedDates.has(date.toDateString());
          return (
            <div
              key={date.toISOString()}
              className={`h-10 rounded-lg flex items-center justify-center text-sm ${
                isApproved ? "bg-emerald-200 text-emerald-900" : "bg-white/70"
              }`}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
