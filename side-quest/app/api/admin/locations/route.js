/*
	Name: locations/route.js
	Description: API endpoint for editing locations
	Programmers: Alejandro Sandoval
	Date: 11/23/2025
	Revisions: N/A
	Errors: N/A
	Input: Location information
	Output: Commits and queries to the database.
*/

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
	// Get all locations
	const supabase = createAdminClient();
	const { data, error } = await supabase.from("locations").select("*").order("location_id");
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data);
}

export async function POST(request) {
	// Add new location
	const supabase = createAdminClient();
	const body = await request.json().catch(() => ({}));
	const { name, type, x_coordinate, y_coordinate } = body;
	if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 }); // Must have name

	// Commit
	const { data, error } = await supabase
	.from("locations")
	.insert([{ name, type: type ?? null, x_coordinate: x_coordinate ?? 0, y_coordinate: y_coordinate ?? 0 }])
	.select()
	.single();

	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data, { status: 201 });
}

export async function PUT(request) {
	// Update a location
	const supabase = createAdminClient();
	const body = await request.json().catch(() => ({}));
	const { location_id, name, type, x_coordinate, y_coordinate } = body;
	if (location_id === undefined || location_id === null) return NextResponse.json({ error: "Missing location_id" }, { status: 400 });

	// Conditionally update fields
	const updates = {};
	if (name !== undefined) updates.name = name;
	if (type !== undefined) updates.type = type;
	if (x_coordinate !== undefined) updates.x_coordinate = x_coordinate;
	if (y_coordinate !== undefined) updates.y_coordinate = y_coordinate;

	// Commit
	const { data, error } = await supabase
	.from("locations")
	.update(updates)
	.eq("location_id", location_id)
	.select()
	.single();

	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data);
}

export async function DELETE(request) {
	// Delete a location
	const supabase = createAdminClient();
	const body = await request.json().catch(() => ({}));
	const { location_id } = body;
	if (location_id === undefined || location_id === null) return NextResponse.json({ error: "Missing location_id" }, { status: 400 });

	const { error } = await supabase.from("locations").delete().eq("location_id", location_id);
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ success: true });
}