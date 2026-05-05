import { NextRequest, NextResponse } from "next/server";

// Server-side proxy for Google OAuth initiation.
// Avoids CORS: browser calls this (same origin), this calls backend (server-to-server).
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://food-hub-backend-server.vercel.app";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const callbackURL =
    searchParams.get("callbackURL") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://food-hub-frontend-website.vercel.app/";

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/sign-in/social`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: "google", callbackURL }),
      redirect: "manual", // Don't auto-follow – we need the Location header
    });

    // Better Auth responds with 302 redirect to Google OR JSON { url }
    if (res.status === 301 || res.status === 302) {
      const location = res.headers.get("location");
      if (location) return NextResponse.redirect(location);
    }

    // Some Better Auth versions return { url } in JSON
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      if (json?.url) return NextResponse.redirect(json.url);
    } catch {}

    return NextResponse.json(
      { error: "Could not get OAuth URL from backend", raw: text },
      { status: 502 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Proxy error", detail: String(err) },
      { status: 500 }
    );
  }
}
