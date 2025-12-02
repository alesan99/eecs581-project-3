/*
	Name: quests/page.js
	Description: Quests page showing all quests with completion status.
	Programmers: Pashia Vang
	Date: 11/06/2025
	Revisions: N/A
	Errors: N/A
	Input: 
		- User auth token (cookie)
		- Quest data from database (locations, quests)
		- User progress data (completed quests)
	Output: 
		- Rendered page showing quests by location
		- Completion statistics
		- progress bars, notifications
*/

import { requireAuthOrRedirect } from "@/lib/requireAuth";
import { cookies } from "next/headers";
import { verifyToken } from "../../lib/auth";
import { createAdminClient } from "../../lib/supabase/admin";
import Link from "next/link";
import { CheckCircle2, MapPin, Trophy, Compass, ArrowRight, Star, Sparkles } from "lucide-react";
import AnimatedProgressBar from "./progress-bar";

export default async function QuestsPage() {
	// redirect if not authenticated
	requireAuthOrRedirect();

	// read token from cookie and verify
	const cookieStore = await cookies();
	const token = cookieStore.get("sid")?.value;
	const user = token ? verifyToken(token) : null;

	// If the user isn't logged in or the token fails verification,
	// show a simple message prompting them to log in
	if (!user) {
		return (
			<div className="max-w-4xl mx-auto p-8">
				<h2 className="text-xl font-semibold">Not logged in</h2>
				<p>Please <a href="/login" className="text-blue-600">login</a>.</p>
			</div>
		);
	}

	const supabase = createAdminClient();

	// Get all quests with location info
	const { data: allQuests } = await supabase
		.from("quests")
		.select(`
			quest_id,
			text,
			location_id,
			locations (
				location_id,
				name
			)
		`)
		.order("location_id");

	// Get user's progress (both completed and uncompleted)
	const { data: progress } = await supabase
		.from("progress")
		.select(`
			quest_id,
			completed,
			completed_at,
			quests (
				quest_id,
				text,
				location_id
			)
		`)
		.eq("user_id", user.id);

	// Create a map of quest_id -> completion status
	const progressMap = {};
	progress?.forEach(p => {
		const quest = Array.isArray(p.quests) ? p.quests[0] : p.quests;
		if (quest) {
			progressMap[quest.quest_id] = {
				completed: p.completed,
				completed_at: p.completed_at
			};
		}
	});

	// Organize all quests by location
	const questsByLocation = {};
	let totalCompleted = 0;
	let totalQuests = 0;

	allQuests?.forEach(quest => {
		// Find quest
		const location = Array.isArray(quest.locations) ? quest.locations[0] : quest.locations;
		if (!location) return;
		// Get quest information
		const locationName = location.name;
		if (!questsByLocation[locationName]) {
			questsByLocation[locationName] = [];
		}

		const questProgress = progressMap[quest.quest_id];
		const isCompleted = questProgress?.completed || false;
		
		// Gather stats to calculate total progression
		if (isCompleted) {
			totalCompleted++;
		}
		totalQuests++;

		questsByLocation[locationName].push({
			quest_id: quest.quest_id,
			text: quest.text,
			completed: isCompleted,
			completed_at: questProgress?.completed_at
		});
	});

	// Calculate total quest completion percentage based on stats from above.
	const completionPercentage = totalQuests > 0 ? Math.round((totalCompleted / totalQuests) * 100) : 0;

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#FFF6D8] via-yellow-50 to-orange-50 p-8 relative overflow-hidden">
			{/* Fun floating background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 left-10 w-20 h-20 bg-[#00AEEF] opacity-20 rounded-full blur-xl"></div>
				<div className="absolute top-40 right-20 w-32 h-32 bg-[#FF7A00] opacity-20 rounded-full blur-xl"></div>
				<div className="absolute bottom-32 left-1/4 w-24 h-24 bg-[#FFDA00] opacity-20 rounded-full blur-xl"></div>
			</div>

			<div className="max-w-5xl mx-auto relative z-10">
				{/* Header */}
				<div className="mb-8 text-center">
					<div className="flex items-center justify-center gap-4 mb-4">
						<Compass className="w-12 h-12 text-[#00AEEF]" />
						<Star className="w-10 h-10 text-[#FF7A00]" />
						<Trophy className="w-12 h-12 text-[#00AEEF]" />
					</div>
					<h1 className="text-6xl font-extrabold text-[#FF7A00] drop-shadow-[3px_3px_#FFDA00] mb-3">
						Your Quests
					</h1>
					<p className="text-xl text-[#00AEEF] font-semibold">Track your epic campus adventures!</p>
				</div>

				{/* Statistics Cards - Fun Style */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
					<div className="bg-white rounded-2xl p-6 border-4 border-[#00AEEF] shadow-[6px_6px_0_#FF7A00] hover:shadow-[8px_8px_0_#FF7A00] transform hover:scale-105 transition-all text-center">
						<CheckCircle2 className="w-12 h-12 text-[#00AEEF] mx-auto mb-3" />
						<div className="text-5xl font-bold text-[#FF7A00] mb-2">{totalCompleted}</div>
						<div className="text-lg font-semibold text-gray-700">Completed</div>
					</div>
					<div className="bg-white rounded-2xl p-6 border-4 border-[#FF7A00] shadow-[6px_6px_0_#00AEEF] hover:shadow-[8px_8px_0_#00AEEF] transform hover:scale-105 transition-all text-center">
						<Compass className="w-12 h-12 text-[#FF7A00] mx-auto mb-3" />
						<div className="text-5xl font-bold text-[#00AEEF] mb-2">{totalQuests}</div>
						<div className="text-lg font-semibold text-gray-700">Total Quests</div>
					</div>
					<div className="bg-white rounded-2xl p-6 border-4 border-[#FFDA00] shadow-[6px_6px_0_#FF7A00] hover:shadow-[8px_8px_0_#FF7A00] transform hover:scale-105 transition-all text-center">
						<Trophy className="w-12 h-12 text-[#FF7A00] mx-auto mb-3" />
						<div className="text-5xl font-bold text-[#00AEEF] mb-2">{completionPercentage}%</div>
						<div className="text-lg font-semibold text-gray-700">Complete</div>
					</div>
				</div>

				{/* Quests by Location */}
				{totalQuests > 0 ? (
					<div className="space-y-6">
						{Object.entries(questsByLocation).map(([locationName, quests], index) => {
							const locationCompleted = quests.filter(q => q.completed).length;
							const locationTotal = quests.length;
							const locationPercentage = locationTotal > 0 ? Math.round((locationCompleted / locationTotal) * 100) : 0;
							
							// Alternate border colors for variety
							const borderColors = [
								{ border: '#00AEEF', shadow: '#FF7A00' },
								{ border: '#FF7A00', shadow: '#00AEEF' },
								{ border: '#FFDA00', shadow: '#FF7A00' },
								{ border: '#00AEEF', shadow: '#FFDA00' }
							];
							const colors = borderColors[index % borderColors.length];

							return (
								<div 
									key={locationName} 
									className="bg-white rounded-2xl p-6 border-4 transform hover:scale-[1.02] transition-all group"
									style={{ 
										borderColor: colors.border,
										boxShadow: `8px 8px 0 ${colors.shadow}`
									}}
								>
									{/* Location Header */}
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-3">
											<MapPin className="w-8 h-8" style={{ color: colors.border }} />
											<h3 className="text-3xl font-bold text-[#FF7A00] drop-shadow-[2px_2px_#FFDA00]">
												{locationName}
											</h3>
										</div>
										<div className="text-right bg-[#FFF6D8] px-4 py-2 rounded-xl border-2 border-[#FF7A00]">
											<div className="text-2xl font-bold text-[#00AEEF]">
												{locationCompleted} / {locationTotal}
											</div>
											<div className="text-sm font-semibold text-[#FF7A00]">{locationPercentage}% complete</div>
										</div>
									</div>

									{/* Progress Bar - Animated on Scroll */}
									<AnimatedProgressBar 
										percentage={locationPercentage} 
										color={colors.border}
										shadowColor={colors.shadow}
									/>

									{/* Quest List */}
									<ul className="space-y-3">
										{quests.map((quest) => (
											<li 
												key={quest.quest_id} 
												className={`flex items-start gap-4 p-4 rounded-xl transition-all hover:scale-[1.02] ${
													quest.completed 
														? `bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-400 shadow-[4px_4px_0_#10b981]` 
														: `bg-white border-4 border-gray-300 shadow-[4px_4px_0_#9ca3af]`
												}`}
												style={!quest.completed ? { 
													borderColor: 'rgb(156, 163, 175)',
													'--hover-color': colors.border
												} : {}}
											>
												{quest.completed && (
													<div className="relative">
														<CheckCircle2 className="w-8 h-8 text-green-600 mt-0.5 flex-shrink-0" />
														<Star className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
													</div>
												)}
												<div className="flex-1">
													<div className={`text-lg font-bold ${
														quest.completed 
															? "text-green-700 line-through decoration-2 decoration-green-500" 
															: "text-gray-800"
													}`}>
														{quest.text}
													</div>
													{quest.completed && quest.completed_at && (
														<div className="text-xs text-green-600 mt-2 font-semibold flex items-center gap-1">
															<Sparkles className="w-3 h-3" />
															Completed: {new Date(quest.completed_at).toLocaleDateString('en-US', {
																year: 'numeric',
																month: 'short',
																day: 'numeric',
																hour: '2-digit',
																minute: '2-digit'
															})}
														</div>
													)}
												</div>
											</li>
										))}
									</ul>
								</div>
							);
						})}
					</div>
				) : (
					<div className="bg-white rounded-2xl p-12 text-center border-4 border-[#00AEEF] shadow-[8px_8px_0_#FF7A00]">
						<Compass className="w-20 h-20 text-gray-300 mx-auto mb-4" />
						<p className="text-2xl font-bold text-gray-600 mb-2">No quests available yet!</p>
						<p className="text-lg text-gray-500">Check back later for new quests.</p>
					</div>
				)}

				{/* Call to Action - Fun Style */}
				{totalQuests > 0 && totalCompleted < totalQuests && (
					<div className="mt-10 bg-white rounded-2xl p-8 text-center border-4 border-[#FF7A00] shadow-[10px_10px_0_#00AEEF] hover:shadow-[12px_12px_0_#00AEEF] transform hover:scale-[1.02] transition-all">
						<div className="flex items-center justify-center gap-3 mb-4">
							<Trophy className="w-12 h-12 text-[#FF7A00]" />
							<Star className="w-10 h-10 text-[#FFDA00] animate-pulse" />
							<Sparkles className="w-12 h-12 text-[#00AEEF]" />
						</div>
						<h3 className="text-3xl font-bold text-[#FF7A00] mb-3 drop-shadow-[2px_2px_#FFDA00]">
							Continue Your Epic Journey!
						</h3>
						<p className="text-xl text-[#00AEEF] mb-6 font-semibold flex items-center justify-center gap-2">
							You&apos;ve completed <span className="text-[#FF7A00] font-bold">{totalCompleted}</span> of <span className="text-[#FF7A00] font-bold">{totalQuests}</span> quests. Keep exploring to complete them all! <Sparkles className="w-6 h-6 text-[#FF7A00]" />
						</p>
						<Link 
							href="/map" 
							className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#FF7A00] text-white font-bold text-xl rounded-2xl shadow-[8px_8px_0_#00AEEF] hover:shadow-[10px_10px_0_#00AEEF] transform hover:scale-105 transition-all duration-200 overflow-hidden"
						>
							<span className="relative z-10">Go to Map</span>
							<ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
							<div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						</Link>
					</div>
				)}

				{/* Completion Celebration */}
				{totalQuests > 0 && totalCompleted === totalQuests && (
					<div className="mt-10 bg-gradient-to-r from-[#FFDA00] via-[#FF7A00] to-[#FFDA00] rounded-2xl p-10 text-center border-4 border-[#00AEEF] shadow-[12px_12px_0_#FF7A00] animate-pulse">
						<div className="flex items-center justify-center gap-4 mb-4">
							<Trophy className="w-16 h-16 text-white" />
							<Star className="w-14 h-14 text-white animate-spin" />
							<Sparkles className="w-16 h-16 text-white" />
						</div>
						<h3 className="text-4xl font-bold text-white mb-3 drop-shadow-[3px_3px_#00AEEF] flex items-center justify-center gap-3">
							<Sparkles className="w-10 h-10" /> QUEST MASTER! <Sparkles className="w-10 h-10" />
						</h3>
						<p className="text-2xl text-white font-bold mb-2">
							You&apos;ve completed ALL {totalQuests} quests!
						</p>
						<p className="text-xl text-white opacity-90 flex items-center justify-center gap-2">
							You&apos;re a true campus explorer! <Trophy className="w-6 h-6" />
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

