/*
	Name: Logout API endpoint
	Description: Logs a user out upon request
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
	Input: User logout request via session cookie
	Output: Print message and user redirected to login page
*/

export async function POST() {
	// Overwrite the session cookie (sid) with an expired one to clear authentication
	const expire = `sid=deleted; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
	
	// Return redirect response to login page after clearing session
	return new Response(null, {
		status: 303,
		headers: {
			"Set-Cookie": expire,  // expire session token
			"Location": "/login",  // send user back to login page
		},
	});
}
