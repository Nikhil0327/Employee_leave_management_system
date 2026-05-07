import api from "./client.js";

export async function getSummary(year) {
  const { data } = await api.get("/api/analytics/summary", {
    params: { year },
  });

  return data;
}
