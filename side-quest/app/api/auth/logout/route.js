/*
	Name: Logout API endpoint
	Description: Logs a user out upon request
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/

export async function POST() {
	const expire = `sid=deleted; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
	return new Response(null, {
		status: 303,
		headers: {
			"Set-Cookie": expire,
			"Location": "/login",
		},
	});
}