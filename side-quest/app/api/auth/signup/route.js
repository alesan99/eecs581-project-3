/*
	Name: Signup API endpoint
	Description: Creates a new user account.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/

import { createAdminClient } from "../../../../lib/supabase/admin";
import bcrypt from "bcryptjs";
import { signPayload } from "../../../../lib/auth";

export async function POST(req) {
	const body = await req.json();
	const { name, email, password } = body;
	const supabase = createAdminClient();

	// Validate input
	if (!name || !email || !password) {
		return new Response(
			JSON.stringify({ message: "All fields are required" }),
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}

	// Check if user already exists
	const { data: existingUser } = await supabase
		.from("users")
		.select("email")
		.eq("email", email)
		.single();

	if (existingUser) {
		return new Response(
			JSON.stringify({ message: "User with this email already exists" }),
			{ status: 409, headers: { "Content-Type": "application/json" } }
		);
	}

	// Hash password
	const password_hash = await bcrypt.hash(password, 10);

	// Insert new user
	const { data: user, error } = await supabase
		.from("users")
		.insert([
			{
				name,
				email,
				password_hash,
			}
		])
		.select()
		.single();

	if (error) {
		return new Response(
			JSON.stringify({ message: "Failed to create account" }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
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

	const cookie = `sid=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`;
	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
	});
}
