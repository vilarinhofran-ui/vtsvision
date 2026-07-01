import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "./lib/auth-session";

const protectedPrefixes = ["/dashboard", "/importar", "/insights"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSessionCookie = Boolean(
    request.cookies.get(AUTH_COOKIE_NAME)?.value,
  );

  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );
  if (isProtected && !hasSessionCookie) {
    const nextUrl = `${pathname}${search}`;
    const loginUrl = new URL(
      `/login?next=${encodeURIComponent(nextUrl)}`,
      request.url,
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
