import api from "./client.js";

export async function getRegistrationMeta() {
  const { data } = await api.get("/api/public/registration-meta");
  return data;
}
