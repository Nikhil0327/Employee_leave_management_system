import api from "./client.js";

export async function listUsers() {
  const { data } = await api.get("/api/admin/users");
  return data;
}

export async function createUser(payload) {
  const { data } = await api.post("/api/admin/users", payload);
  return data;
}

export async function getPolicy() {
  const { data } = await api.get("/api/policy");
  return data;
}

export async function updatePolicy(payload) {
  const { data } = await api.put("/api/policy", payload);
  return data;
}

export async function getLeavePredictions() {
  const { data } = await api.post("/api/admin/ml/predict");
  return data;
}
