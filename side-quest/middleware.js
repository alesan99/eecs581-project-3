/*
	Name: middleware.js
	Description: Website middleware to direct users.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
	Input: Incoming page requests
	Output:
		Handled page response, handles routing
		Login redirection if needed
*/

import { NextResponse } from "next/server";

export function middleware(request) {
	const { pathname } = request.nextUrl;

	// allow public/static and login/api/signup/landing page
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/static") ||
		pathname === "/favicon.ico" ||
		pathname.startsWith("/api") ||
		pathname === "/login" ||
		pathname === "/signup" ||
		pathname === "/"
	) {
		return NextResponse.next();
	}
	// Retrieve session token from cookies
	const token = request.cookies.get("sid")?.value;

	// Redirect to login if no token found
	if (!token) {
		const url = new URL("/login", request.url);
		return NextResponse.redirect(url);
	}
	
	// Allow request to continue if token exists
	return NextResponse.next();
}

// Middleware applies to all routes except API, static files, _next, and favicon
export const config = {
	matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
