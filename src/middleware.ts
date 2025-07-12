import { verifyPaseto } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = await verifyPaseto(token);

    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.sub?.toString() || "");
    response.headers.set("x-user-email", payload.email?.toString() || "");
    response.headers.set("x-user-role", payload.role?.toString() || "");

    return response;
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  runtime: "nodejs",
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
