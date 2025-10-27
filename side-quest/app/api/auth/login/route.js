/*
	Name: Login API endpoint
	Description: Logs a user in upon request.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/

import { createAdminClient } from "../../../../lib/supabase/admin";
import bcrypt from "bcryptjs";
import { signPayload } from "../../../../lib/auth";

export async function POST(req) {
	// Parse the incoming request body (expected JSON: { email, password })
	const body = await req.json();
	const { email, password } = body;
	const supabase = createAdminClient();

	// Find user by email
	const { data: user, error } = await supabase
		.from("users")
		.select("*")
		.eq("email", email)
		.single();
	
	// If no user exists or Supabase returns an error, reject login
	if (error || !user) {
		return new Response(
			JSON.stringify({ message: "Invalid credentials" }),
			{ status: 401, headers: { "Content-Type": "application/json" } }
		);
	}

	// Verify password
	const isValid = await bcrypt.compare(password, user.password_hash);
	if (!isValid) {
		return new Response(
			JSON.stringify({ message: "Invalid credentials" }),
			{ status: 401, headers: { "Content-Type": "application/json" } }
		);
	}

	// Create session token
	const token = signPayload({
		id: user.user_id,
		email: user.email,
		name: user.name,
		// expire in 30 days
		exp: Date.now() + 1000 * 60 * 60 * 24 * 30
	});
	// Set cookie for the session token
	const cookie = `sid=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`;
	// Return success response and attach the cookie in headers
	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
	});
}
