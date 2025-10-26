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
import ToolbarClient from "./toolbar-client";

export default async function Toolbar() {
	// Check if user is logged in.
	const cookieStore = await cookies();
	const token = cookieStore.get("sid")?.value;
	const user = token ? verifyToken(token) : null;

	return <ToolbarClient user={user} />;
}