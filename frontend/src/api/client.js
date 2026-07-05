const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  getCategories: () => request("/categories"),
  joinQueue: (payload) => request("/queue/join", { method: "POST", body: JSON.stringify(payload) }),
  getStatus: (tokenId) => request(`/queue/status/${tokenId}`),
  getQueueByCategory: (categoryId) => request(`/queue/category/${categoryId}`),
  getHistory: (categoryId) => request(`/queue/category/${categoryId}/history`),
  callNext: (payload) => request("/queue/call-next", { method: "POST", body: JSON.stringify(payload) }),
  markServed: (id) => request(`/queue/${id}/serve`, { method: "POST" }),
  markNoShow: (id) => request(`/queue/${id}/no-show`, { method: "POST" }),
  staffLogin: (payload) => request("/staff/login", { method: "POST", body: JSON.stringify(payload) }),
  getCounters: () => request("/counters"),
  getMyCounter: (staffId) => request(`/counters/my-counter/${staffId}`),
};
