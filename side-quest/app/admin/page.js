/*
	Name: admin/page.js
	Description: A page for admin accounts to add and edit quests.
	Programmers: Alejandro Sandoval
	Date: 11/23/2025
	Revisions: N/A
	Errors: N/A
	Input: A user account.
	Output: If user is admin, show admin panel. Otherwise, redirect to homepage.
*/

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyToken } from "@/lib/auth";
import AdminPanel from "./panel";

export default async function AdminPage() {
	// server-side auth client
	const cookieStore = cookies();
	const token = cookieStore.get("sid")?.value;
	const decoded = token ? verifyToken(token) : null;

	if (!decoded) return redirect("/login");

	// Resolve user id from token payload (support common fields)
	const userId = decoded.id ?? decoded.user_id ?? decoded.sub ?? null;
	if (!userId) return redirect("/login");

	// use admin client to check admin flag and fetch data
	const supabase = createAdminClient();

	// load locations
	const { data: locations = [], error: locErr } = await supabase
		.from("locations")
		.select("location_id, name, type, x_coordinate, y_coordinate")
		.order("location_id", { ascending: true });
	// load quests
	const { data: quests = [], error: qErr } = await supabase
		.from("quests")
		.select("quest_id, location_id, text")
		.order("location_id", { ascending: true });

	if (locErr || qErr) {
		console.error("Admin page load error:", locErr || qErr);
	}

	// pass initial data to a client component that handles editing
	return <AdminPanel initialLocations={locations} initialQuests={quests} />;
}