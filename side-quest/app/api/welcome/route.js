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

function getCookieValue(req, name) {
	const cookieHeader = req.headers.get("cookie") || "";
	const match = cookieHeader
		.split(";")
		.map(part => part.trim())
		.find(part => part.startsWith(`${name}=`));

	return match ? match.split("=")[1] : null;
}

export async function GET(req) {
	const show = getCookieValue(req, "welcome_new") === "1";
	return NextResponse.json({ show }, { status: 200 });
}

export async function POST() {
	const headers = new Headers({ "Content-Type": "application/json" });
	headers.append("Set-Cookie", "welcome_new=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");

	return new NextResponse(JSON.stringify({ ok: true }), {
		status: 200,
		headers,
	});
}

