const API_BASE_URL = "https://hinansho-client-portal-backend.onrender.com";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("token") || "";

    const res = await fetch(`${API_BASE_URL}/investor/documents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: authHeader,
      },
    });

    const data = await res.json().catch(() => ({}));
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "upstream_error", details: String(err) }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
}
