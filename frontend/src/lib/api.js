const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(errorPayload?.message || "Request failed.");
  }

  return response.json();
}

export function getTodayRevisions() {
  return apiRequest("/revisions/today");
}

export function addProblem(payload) {
  return apiRequest("/problems", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function getProblems() {
  return apiRequest("/problems");
}

export function updateProblem(problemId, payload) {
  return apiRequest(`/problems/${problemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function deleteProblem(problemId) {
  return apiRequest(`/problems/${problemId}`, {
    method: "DELETE",
  });
}

export function updateRevision(revisionId, status) {
  return apiRequest(`/revisions/${revisionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
}

export function getDashboard() {
  return apiRequest("/dashboard");
}
