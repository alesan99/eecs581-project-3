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
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Set-Cookie": expire, "Content-Type": "application/json" },
  });
}