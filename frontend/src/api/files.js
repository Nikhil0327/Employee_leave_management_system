import api from "./client.js";

export async function uploadFile(file) {

  const form = new FormData();

  form.append("file", file);

  const { data } = await api.post("/api/files", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
