/*
	Name: requireAuth.js
	Description: Util to require a user to be logged in to access a page.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "./auth";

export function requireAuthOrRedirect() {
	const token = cookies().get("sid")?.value;
	if (!token || !verifyToken(token)) {
		redirect("/login");
	}
}