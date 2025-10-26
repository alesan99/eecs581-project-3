/*
	Name: Login API endpoint
	Description: Logs a user in upon request.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/

import { promises as fs } from "fs";
import path from "path";
import { signPayload } from "../../../../lib/auth";

export async function POST(req) {
	const body = await req.json();
	const { email, password } = body;
	const dbPath = path.join(process.cwd(), "data", "users.json");
	const raw = await fs.readFile(dbPath, "utf8");
	const users = JSON.parse(raw);

	const user = users.find(u => u.email === email && u.password === password);
	if (!user) {
		return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401, headers: { "Content-Type": "application/json" } });
	}

	const token = signPayload({
		id: user.id,
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