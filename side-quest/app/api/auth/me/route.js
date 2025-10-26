/*
	Name: Current user API endpoint
	Description: Gets the current user upon request.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/

import { verifyToken } from "../../../../lib/auth";

export async function GET(req) {
	const cookie = req.headers.get("cookie") || "";
	const match = cookie.split(";").map(s => s.trim()).find(s => s.startsWith("sid="));
	const token = match?.split("=")[1];
	const user = token ? verifyToken(token) : null;
	if (!user) {
		return new Response(JSON.stringify({ user: null }), { status: 200, headers: { "Content-Type": "application/json" } });
	}
	return new Response(JSON.stringify({ user }), { status: 200, headers: { "Content-Type": "application/json" } });
}