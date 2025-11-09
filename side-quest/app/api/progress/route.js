/*
	Name: Progress API endpoint
	Description: Gets and saves user quest progress.
	Programmers: Pashia Vang
	Date: 11/06/2025
	Revisions: N/A
	Errors: N/A
	Input:  User authentication cookie and quest progress data  
	Output:  Updated or retrieved quest progress information
*/

import { verifyToken } from "../../../lib/auth";
import { createAdminClient } from "../../../lib/supabase/admin";

// Helper function to get user from request
function getUserFromRequest(req) {
	const cookie = req.headers.get("cookie") || "";
	const match = cookie.split(";").map(s => s.trim()).find(s => s.startsWith("sid="));
	const token = match?.split("=")[1];
	return token ? verifyToken(token) : null;
}

// GET: Retrieve all progress for the current user
export async function GET(req) {
	const user = getUserFromRequest(req);
	
	if (!user) {
		return new Response(
			JSON.stringify({ message: "Unauthorized" }),
			{ status: 401, headers: { "Content-Type": "application/json" } }
		);
	}

	const supabase = createAdminClient();

	// Get all progress records for this user, including quest and location info
	const { data: progress, error } = await supabase
		.from("progress")
		.select(`
			progress_id,
			quest_id,
			completed,
			completed_at,
			quests (
				quest_id,
				text,
				location_id,
				locations (
					location_id,
					name
				)
			)
		`)
		.eq("user_id", user.id);

	if (error) {
		return new Response(
			JSON.stringify({ message: "Failed to fetch progress", error: error.message }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}

	// Transform the data to a simpler format: location_name -> quest_text -> completed
	const progressMap = {};
	progress?.forEach(p => {
		// Handle nested structure - quests might be an array or object
		const quest = Array.isArray(p.quests) ? p.quests[0] : p.quests;
		if (!quest) return;
		
		const location = Array.isArray(quest.locations) ? quest.locations[0] : quest.locations;
		if (!location) return;
		
		const locationName = location.name;
		const questText = quest.text;
		if (!progressMap[locationName]) {
			progressMap[locationName] = {};
		}
		progressMap[locationName][questText] = {
			completed: p.completed,
			completed_at: p.completed_at,
			quest_id: p.quest_id
		};
	});

	return new Response(
		JSON.stringify({ progress: progressMap }),
		{ status: 200, headers: { "Content-Type": "application/json" } }
	);
}

// POST: Save or update quest progress
export async function POST(req) {
	const user = getUserFromRequest(req);
	
	if (!user) {
		return new Response(
			JSON.stringify({ message: "Unauthorized" }),
			{ status: 401, headers: { "Content-Type": "application/json" } }
		);
	}

	const body = await req.json();
	const { location_name, quest_text, completed } = body;

	if (!location_name || !quest_text || typeof completed !== "boolean") {
		return new Response(
			JSON.stringify({ message: "Missing required fields: location_name, quest_text, completed" }),
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}

	const supabase = createAdminClient();

	// First, find the location_id by name
	const { data: location, error: locationError } = await supabase
		.from("locations")
		.select("location_id")
		.eq("name", location_name)
		.single();

	if (locationError || !location) {
		return new Response(
			JSON.stringify({ message: "Location not found", error: locationError?.message }),
			{ status: 404, headers: { "Content-Type": "application/json" } }
		);
	}

	// Then find the quest_id by location_id and quest text
	const { data: quest, error: questError } = await supabase
		.from("quests")
		.select("quest_id")
		.eq("location_id", location.location_id)
		.eq("text", quest_text)
		.single();

	if (questError || !quest) {
		return new Response(
			JSON.stringify({ message: "Quest not found", error: questError?.message }),
			{ status: 404, headers: { "Content-Type": "application/json" } }
		);
	}

	// Check if progress record already exists
	const { data: existingProgress } = await supabase
		.from("progress")
		.select("progress_id")
		.eq("user_id", user.id)
		.eq("quest_id", quest.quest_id)
		.single();

	const now = new Date().toISOString();
	const progressData = {
		user_id: user.id,
		quest_id: quest.quest_id,
		completed: completed,
		updated_at: now
	};

	if (completed) {
		progressData.completed_at = now;
	} else {
		progressData.completed_at = null;
	}

	let result;
	if (existingProgress) {
		// Update existing progress
		const { data, error } = await supabase
			.from("progress")
			.update(progressData)
			.eq("progress_id", existingProgress.progress_id)
			.select()
			.single();
		
		result = { data, error };
	} else {
		// Insert new progress
		const { data, error } = await supabase
			.from("progress")
			.insert([progressData])
			.select()
			.single();
		
		result = { data, error };
	}

	// Send error response if something went wrong. The client will see a notification.
	if (result.error) {
		return new Response(
			JSON.stringify({ message: "Failed to save progress", error: result.error.message }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}

	// Success.
	return new Response(
		JSON.stringify({ success: true, progress: result.data }),
		{ status: 200, headers: { "Content-Type": "application/json" } }
	);
}

