import api from "./client.js";

export async function getMonthlyReport(year, month) {

  const { data } = await api.get("/api/reports/monthly", {
    params: { year, month },
  });

  return data;
}

export async function downloadMonthlyCsv(year, month) {

  const response = await api.get("/api/reports/monthly.csv", {
    params: { year, month },
    responseType: "blob",
  });

  return response.data;
}
