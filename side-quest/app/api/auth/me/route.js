/*
	Name: Current user API endpoint
	Description: Gets the current user upon request.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
	Input: Session cookie containing user token
	Output: JSON response with current user data or null if not logged in
*/

import { verifyToken } from "../../../../lib/auth";

export async function GET(req) {
	// Retrieve cookies from the incoming request headers
	const cookie = req.headers.get("cookie") || "";
	// Search for the session identifier (sid) cookie in the header string
	const match = cookie.split(";").map(s => s.trim()).find(s => s.startsWith("sid="));
	// Extract token value from cookie if found
	const token = match?.split("=")[1];

	// Attempt to verify the token and decode user data
	const user = token ? verifyToken(token) : null;

	// If verification fails or no user is found, return a null user response
	if (!user) {
		return new Response(JSON.stringify({ user: null }), { status: 200, headers: { "Content-Type": "application/json" } });
	}
	return new Response(JSON.stringify({ user }), { status: 200, headers: { "Content-Type": "application/json" } });
}
