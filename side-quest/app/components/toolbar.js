/*
	Name: toolbar.js
	Description: Defines the top toolbar of every page.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
	Input: Session cookie from request headers
	Output: ToolbarClient component with user info if authenticated, or null 
*/

import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "../../lib/auth";
import ToolbarClient from "./toolbar-client";

export default async function Toolbar() {
	// Check if user is logged in.
	const cookieStore = await cookies();
	const token = cookieStore.get("sid")?.value;
	
	// Verify the token to get user info; null if not authenticated
	const user = token ? verifyToken(token) : null;

	// Render the client toolbar with user info
	return <ToolbarClient user={user} />;
}
