import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "./auth";

export function requireAuthOrRedirect() {
	// Retrieve session token from cookies
	const token = cookies().get("sid")?.value;
	// Verify token; redirect if invalid or missing
	if (!token || !verifyToken(token)) {
		redirect("/login");
	}
}
