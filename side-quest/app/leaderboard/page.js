/*
	Name: page.js
	Description: Page to view leaderboard of global user progress.
	Programmers: Alejandro Sandoval, Pashia Vang
	Date: 10/25/2025
	Revisions: Update UI style - 10/26/2025, Add functional list of user rankings - 11/22/2025
	Errors: N/A
	Input: Global user progress data from the server
	Output: Leaderboard page displaying user rankings
	
*/
import { createAdminClient } from "@/lib/supabase/admin";

export default async function LeaderboardsPage() {
	const supabase = createAdminClient();

	// Get all completed progress rows and sum counts by user_id for sorting
	const { data: rows, error: rowsErr } = await supabase
		.from("progress")
		.select("user_id")
		.eq("completed", true);

	if (rowsErr) {
		// Show an error page if leaderboard could not be loaded
		console.error("Failed to load progress:", rowsErr);
		return (
			<div className="max-w-6xl mx-auto p-8">
				<h2 className="text-3xl font-bold mb-4 text-[#FF7A00]">Leaderboard</h2>
				<p className="text-red-600">Failed to load leaderboard data.</p>
			</div>
		);
	}

	// Count completed quests per user
	const counts = {};
	for (const r of rows || []) {
		const id = String(r.user_id ?? "unknown");
		counts[id] = (counts[id] || 0) + 1;
	}

	// Create sorted top-20 list
	const sorted = Object.entries(counts)
		.map(([userId, completedCount]) => ({ userId, completedCount }))
		.sort((a, b) => b.completedCount - a.completedCount)
		.slice(0, 20);

	// Fetch basic user/profile info for these user ids (try profiles table first)
	const userIds = sorted.map(s => s.userId);
	let users = [];
	if (userIds.length > 0) {
		// Get all user information
		const { data: profiles, error: profErr } = await supabase
			.from("users")
			.select("user_id, name")
			.in("user_id", userIds);
		// Compile in profiles list
		users = profiles.map(p => ({
			id: p.user_id,
			name: p.name || p.email || p.id,
			email: p.email,
		}));
	}

	// Create a reference object to get users by id
	const usersById = Object.fromEntries(users.map(u => [String(u.id), u]));

	// Return a list of the top 20 users in a vertical list of cars
	return (
		<div className="max-w-6xl mx-auto p-8">
			<h2 className="text-3xl font-bold mb-4 text-[#FF7A00]">Leaderboard</h2>

			{sorted.length === 0 ? (
				<p className="text-gray-600">No completed quests yet.</p>
			) : (
				<ol className="space-y-2">
					{sorted.map((row, i) => {
						// Render each player card
						const place = i + 1;
						const user = usersById[row.userId]; // use reference list
						const displayName = user?.name || row.userId; // fallback to user id if name could not be found
						return (
							<li
								key={row.userId}
								className="flex items-center justify-between gap-4 bg-white rounded-lg p-4 shadow-lg"
							>
								<div className="flex items-center gap-4">
									<div className="w-10 text-xl font-bold text-gray-700">{place}.</div>
									<div>
										<div className="font-medium text-gray-900">{displayName}</div>
									</div>
								</div>
								<div className="text-lg font-semibold text-[#FF7A00]">{`Completed quests: ${row.completedCount}`}</div>
							</li>
						);
					})}
				</ol>
			)}
		</div>
	);
}