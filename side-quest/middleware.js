/*
	Name: middleware.js
	Description: Website middleware to direct users.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/

import { NextResponse } from "next/server";

export function middleware(request) {
	const { pathname } = request.nextUrl;

	// allow public/static and login/api/signup
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/static") ||
		pathname === "/favicon.ico" ||
		pathname.startsWith("/api") ||
		pathname === "/login" ||
		pathname === "/signup"
	) {
		return NextResponse.next();
	}

	const token = request.cookies.get("sid")?.value;
	if (!token) {
		const url = new URL("/login", request.url);
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};