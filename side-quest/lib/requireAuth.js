import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "./auth";

export async function requireAuthOrRedirect() {
	// Retrieve session token from cookies
	const cookieStore = await cookies();
	const token = cookieStore.get("sid")?.value;
	// Verify token; redirect if invalid or missing
	if (!token || !verifyToken(token)) {
		redirect("/login");
	}
}
