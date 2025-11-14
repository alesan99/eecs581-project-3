/*
	Name: welcome/route.js
	Description: Provides APIs for managing the one-time welcome modal state per user using cookies.
	Programmers: Pashia Vang
	Date: 11/09/2025
	Revisions: Simplified to use HTTP cookies instead of Supabase storage - 11/09/2025
	Errors: N/A
	Input: Session and welcome cookies from the request headers.
	Output:
		GET  -> { show: boolean }
		POST -> { ok: true } and clears the welcome cookie.
*/

import { NextResponse } from "next/server";

/**
* Retrieves the value of a named cookie from the request.
* @param {Request} req - The incoming HTTP request.
* @param {string} name - The name of the cookie to retrieve.
* @returns {string|null} - The cookie value if found, otherwise null.
*/
function getCookieValue(req, name) {
	const cookieHeader = req.headers.get("cookie") || "";

	// Split cookies, trim, and find the one with the given name
	const match = cookieHeader
		.split(";")
		.map(part => part.trim())
		.find(part => part.startsWith(`${name}=`));

	// Return the value if found, else null
	return match ? match.split("=")[1] : null;
}

/**
* GET handler: returns whether the welcome modal should be shown
* based on the "welcome_new" cookie.
* @param {Request} req - Incoming GET request.
* @returns {NextResponse} JSON response with { show: boolean }
*/
export async function GET(req) {
	const show = getCookieValue(req, "welcome_new") === "1";
	return NextResponse.json({ show }, { status: 200 });
}

/**
* POST handler: clears the "welcome_new" cookie to indicate the modal
* has been seen, returning a JSON { ok: true } response.
* @returns {NextResponse} JSON response confirming the cookie removal.
*/
export async function POST() {
	const headers = new Headers({ "Content-Type": "application/json" });
	// Clear the cookie by setting Max-Age=0
	headers.append("Set-Cookie", "welcome_new=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");

	return new NextResponse(JSON.stringify({ ok: true }), {
		status: 200,
		headers,
	});
}

