const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081";

export async function fetchTestimonials() {
  const res = await fetch(`${API_BASE}/testimonials`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch testimonials");
  }

  return res.json();
}
