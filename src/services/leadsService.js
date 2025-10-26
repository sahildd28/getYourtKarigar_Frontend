const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081";

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function submitLead(lead, token) {
  // Basic validation
  if (!lead || !lead.name || !(lead.email || lead.phone || lead.contact)) {
    throw new Error(
      "Name and at least one contact (email or phone) are required"
    );
  }
  const payload = {
    name: lead.name,
    email: lead.email || null,
    phone: lead.phone || lead.contact || null,
    projectType: lead.projectType || null,
    projectSize: lead.projectSize || null,
    location: lead.location || null,
    address: lead.address || null,
    message: lead.message,
    createdAt: new Date().toISOString(),
    source: lead.source || "frontend",
    userId: lead.userId || null,
  };
  const res = await fetch(`${API_BASE}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let detail = "Failed to submit lead";
    try {
      const body = await res.json();
      detail = body?.message || body?.detail || detail;
    } catch {
      try {
        const text = await res.text();
        if (text) detail = text;
      } catch {
        // ignore fallback parsing errors
      }
    }
    if (res.status === 429 && detail === "Failed to submit lead") {
      detail =
        "You already have an active enquiry. Cancel it before raising a new one.";
    }
    throw new Error(detail);
  }
  return res.json();
}

export async function uploadPortfolio(formData) {
  // formData should contain file and category fields. Backend endpoint: POST /portfolio
  const res = await fetch(`${API_BASE}/portfolio`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload portfolio");
  return res.json();
}

export async function fetchMyLeads(token, userId) {
  let url;
  if (userId) {
    url = `${API_BASE}/leads/${encodeURIComponent(userId)}`;
  }
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
  });
  if (!res.ok) throw new Error("Failed to fetch leads");
  return res.json();
}

export async function updateLead(id, patch, token) {
  const res = await fetch(`${API_BASE}/leads/` + id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update lead");
  return res.json();
}

export async function cancelLead(id, token) {
  const res = await fetch(`${API_BASE}/leads/${id}/cancel`, {
    method: "PATCH",
    headers: { ...authHeader(token) },
  });
  if (!res.ok) {
    let detail = "Failed to cancel lead";
    try {
      const body = await res.json();
      detail = body?.message || body?.detail || detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }
  return res.json();
}
