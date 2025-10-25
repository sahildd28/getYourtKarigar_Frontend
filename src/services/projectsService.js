const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081";

const DEFAULT_FETCH_OPTIONS = {
  headers: { Accept: "application/json" },
};

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`, DEFAULT_FETCH_OPTIONS);
  if (!res.ok) {
    throw new Error(`Failed to load projects (${res.status})`);
  }
  return res.json();
}

export async function fetchProjectById(id) {
  if (!id) throw new Error("project id is required");
  const res = await fetch(
    `${API_BASE}/projects/${encodeURIComponent(id)}`,
    DEFAULT_FETCH_OPTIONS
  );
  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error(`Failed to load project ${id} (${res.status})`);
  }
  return res.json();
}
