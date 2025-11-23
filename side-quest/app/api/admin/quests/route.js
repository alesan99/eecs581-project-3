/*
	Name: quests/route.js
	Description: API endpoint for editing quests
	Programmers: Alejandro Sandoval
	Date: 11/23/2025
	Revisions: N/A
	Errors: N/A
	Input: Quest information
	Output: Commits and queries to the database.
*/

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
	// Get quests
	const supabase = createAdminClient();
	const { data, error } = await supabase
	.from("quests")
	.select("*")
	.order("location_id")
	.order("quest_id");
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data);
}

export async function POST(request) {
	// Add a quest
	const supabase = createAdminClient();
	const body = await request.json().catch(() => ({}));
	const { text, location_id } = body;
	// Must have required fields
	if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });
	if (location_id === undefined || location_id === null) return NextResponse.json({ error: "Missing location_id" }, { status: 400 });

	// commit
	const { data, error } = await supabase
	.from("quests")
	.insert([{ text, location_id }])
	.select()
	.single();

	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data, { status: 201 });
}

export async function PUT(request) {
	// Edit an existing quest
	const supabase = createAdminClient();
	const body = await request.json().catch(() => ({}));
	const { quest_id, text, location_id } = body; // Must have required fields
	if (quest_id === undefined || quest_id === null) return NextResponse.json({ error: "Missing quest_id" }, { status: 400 });
	// Conditionally update fields.
	const updates = {};
	if (text !== undefined) updates.text = text;
	if (location_id !== undefined) updates.location_id = location_id;
	// Commit
	const { data, error } = await supabase
	.from("quests")
	.update(updates)
	.eq("quest_id", quest_id)
	.select()
	.single();

	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data);
}

export async function DELETE(request) {
	// Delete a quest
	const supabase = createAdminClient();
	const body = await request.json().catch(() => ({}));
	const { quest_id } = body;
	if (quest_id === undefined || quest_id === null) return NextResponse.json({ error: "Missing quest_id" }, { status: 400 });
	// Commit
	const { error } = await supabase.from("quests").delete().eq("quest_id", quest_id);
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ success: true });
}