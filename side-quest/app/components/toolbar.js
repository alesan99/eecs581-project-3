/*
  Name: toolbar.js
  Description: Defines the top toolbar of every page.
  Programmers: Alejandro Sandoval
  Date: 10/25/2025
  Revisions: N/A
  Errors: N/A
*/

import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "../../lib/auth";

export default function Toolbar() {
  // Check if user is logged in.
  const cookieStore = cookies();
  const token = cookieStore.get("sid")?.value;
  const user = token ? verifyToken(token) : null;

  // Return toolbar component
  return (
    <header className="toolbar">
      <div className="container toolbar-inner">
        <div className="flex items-center gap-4">
          <Link href="/" className="brand">Side Quest</Link>
          <nav className="nav">
            <Link href="/map" className="nav-link">Map</Link>
            <Link href="/leaderboard" className="nav-link">Leaderboard</Link>
            <Link href="/account" className="nav-link">Account</Link>
          </nav>
        </div>

		{/*Check if user is logged in or not*/}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm">{user.name || user.email}</span>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="btn">Logout</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}