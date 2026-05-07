export function formatDate(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  return date.toLocaleDateString();
}

export function toDateInputValue(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
}

export function expandDateRange(start, end) {
  const result = [];
  const current = new Date(start);
  const last = new Date(end);
  while (current <= last) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return result;
}

export function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [];
  let week = [];

  for (let i = 0; i < startDay; i += 1) {
    week.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    week.push(new Date(year, month, day));
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  return weeks;
}
