/*
  Name: account/page.js
  Description: Account configuration page.
  Programmers: Alejandro Sandoval
  Date: 10/25/2025
  Revisions: N/A
  Errors: N/A
*/

import { requireAuthOrRedirect } from "@/lib/requireAuth";
import { cookies } from "next/headers";
import { verifyToken } from "../../lib/auth";

export default async function AccountPage() {
  // redirect if not authenticated
  requireAuthOrRedirect();

  // read token from cookie and verify
  const token = cookies().get("sid")?.value;
  const user = token ? verifyToken(token) : null;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-xl font-semibold">Not logged in</h2>
        <p>Please <a href="/login" className="text-blue-600">login</a>.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">Account</h2>
      <div>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Name:</strong> {user.name || "-"}</p>
        <form action="/api/auth/logout" method="post" className="mt-4">
          <button className="px-3 py-1 border rounded">Logout</button>
        </form>
      </div>
    </div>
  );
}