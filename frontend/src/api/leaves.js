import api from "./client.js";

export async function applyLeave(payload) {
  const { data } = await api.post("/api/leaves", payload);
  return data;
}

export async function getMyLeaves() {
  const { data } = await api.get("/api/leaves/my");
  return data;
}

export async function getCalendar(start, end) {
  const { data } = await api.get("/api/leaves/calendar", {
    params: { start, end },
  });
  return data;
}

export async function getBalance() {
  const { data } = await api.get("/api/leaves/balance");
  return data;
}

export async function getTeamLeaves(params) {
  const cleaned = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([, value]) => value !== "" && value !== undefined && value !== null,
    ),
  );

  const { data } = await api.get("/api/manager/leaves", {
    params: cleaned,
  });

  return data;
}

export async function decideLeave(id, approved, remarks) {

  const endpoint = approved
    ? `/api/manager/leaves/${id}/approve`
    : `/api/manager/leaves/${id}/reject`;

  const { data } = await api.post(endpoint, { remarks });

  return data;
}

export async function getAllLeaves(params) {

  const cleaned = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([, value]) => value !== "" && value !== undefined && value !== null,
    ),
  );

  const { data } = await api.get("/api/admin/leaves", {
    params: cleaned,
  });

  return data;
}
