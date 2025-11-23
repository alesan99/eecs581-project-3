/*
	Name: map/route.js
	Description: An endpoint to get all map data.
	Programmers: Alejandro Sandoval
	Date: 11/23/2025
	Revisions: N/A
	Errors: N/A
	Input: A request for map data.
	Output: A mapData object of all quests and locations.
*/

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
	// Handle GET request
	try {
		const supabase = createAdminClient();

		// Get all locations from db
		const { data: locations, error: locErr } = await supabase
			.from("locations")
			.select("location_id, name, type, x_coordinate, y_coordinate")
			.order("location_id", { ascending: true });
		// Get all quests from database
		const { data: quests, error: qErr } = await supabase
			.from("quests")
			.select("quest_id, location_id, text, dependency")
			.order("location_id", { ascending: true })
			.order("quest_id", { ascending: true });
		// Handle error
		if (locErr || qErr) {
			const msg = locErr?.message || qErr?.message || "Failed to load map data";
			return NextResponse.json({ error: msg }, { status: 500 });
		}
		// return response
		return NextResponse.json({ locations: locations ?? [], quests: quests ?? [] });
	} catch (err) {
		return NextResponse.json({ error: String(err) }, { status: 500 });
	}
}