/*
	Name: page.js
	Description: Main landing page of Side Quest with hero section, stats, and CTA.
	Programmers: Aidan Barnard, Alejandro Sandoval, Pashia Vang
	Date: 10/25/2025
	Revisions: Update UI style - 10/26/2025
	Errors: N/A
	Input:
		Home navigation or initial website load
	Output:
		Rendered home page with buttons to access other parts of the website
*/

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Map, Compass, Backpack, Star, Sparkles, Trophy, Users } from "lucide-react";

/*
	Component: Home
	Description:
		Main landing page component for Side Quest.
		Includes animated background elements, hero header, fun stats cards, and CTA button.
*/
export default function Home() {
	const [mounted, setMounted] = useState(false);

	// Trigger animations once the component mounts
	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#FFF6D8] via-yellow-50 to-orange-50 flex items-center justify-center p-8 overflow-hidden relative">
			
			{/* Floating background elements for visual depth */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className={`absolute top-20 left-10 w-20 h-20 bg-[#00AEEF] opacity-20 rounded-full blur-xl transition-opacity duration-1000 ${mounted ? 'opacity-20' : 'opacity-0'}`}></div>
				<div className={`absolute top-40 right-20 w-32 h-32 bg-[#FF7A00] opacity-20 rounded-full blur-xl transition-opacity duration-1000 delay-300 ${mounted ? 'opacity-20' : 'opacity-0'}`}></div>
				<div className={`absolute bottom-32 left-1/4 w-24 h-24 bg-[#FFDA00] opacity-20 rounded-full blur-xl transition-opacity duration-1000 delay-500 ${mounted ? 'opacity-20' : 'opacity-0'}`}></div>
			</div>

			<div className="max-w-5xl w-full text-center relative z-10">
				
				{/* Animated icon header */}
				<div className={`flex gap-8 justify-center mb-8 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
					<Map className="w-12 h-12 text-[#00AEEF]" />
					<Compass className="w-12 h-12 text-[#FF7A00]" />
					<Backpack className="w-12 h-12 text-[#00AEEF]" />
					<Star className="w-12 h-12 text-[#FF7A00]" />
					<Trophy className="w-12 h-12 text-[#00AEEF]" />
				</div>

				{/* Main Title */}
				<h1 className={`text-8xl font-extrabold text-[#FF7A00] drop-shadow-[3px_3px_#FFDA00] mb-4 transition-opacity duration-700 delay-100 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
					Side Quest
				</h1>

				{/* Hero subtitle */}
				<p className={`text-xl text-[#00AEEF] mb-12 max-w-3xl mx-auto transition-opacity duration-700 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
					Explore KU campus, complete epic challenges, earn achievements, and dominate the leaderboard.
				</p>

				{/* Fun Stats / Random Facts Section */}
				<div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto transition-opacity duration-700 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
					{/* Card 1 */}
					<div className="bg-white rounded-2xl p-6 border-4 border-[#00AEEF] shadow-[6px_6px_0_#FF7A00] hover:shadow-[8px_8px_0_#FF7A00] transform hover:scale-105 transition-all">
						<Users className="w-10 h-10 text-[#00AEEF] mx-auto mb-2" />
						<p className="text-2xl font-bold text-[#FF7A00]">Join the Squad</p>
						<p className="text-sm text-gray-600">Compete with friends</p>
					</div>

					{/* Card 2 */}
					<div className="bg-white rounded-2xl p-6 border-4 border-[#FF7A00] shadow-[6px_6px_0_#00AEEF] hover:shadow-[8px_8px_0_#00AEEF] transform hover:scale-105 transition-all">
						<Trophy className="w-10 h-10 text-[#FF7A00] mx-auto mb-2" />
						<p className="text-2xl font-bold text-[#00AEEF]">Earn Bragging Rights</p>
						<p className="text-sm text-gray-600">Placeholder</p>
					</div>

					{/* Card 3 */}
					<div className="bg-white rounded-2xl p-6 border-4 border-[#FFDA00] shadow-[6px_6px_0_#FF7A00] hover:shadow-[8px_8px_0_#FF7A00] transform hover:scale-105 transition-all">
						<Sparkles className="w-10 h-10 text-[#FF7A00] mx-auto mb-2" />
						<p className="text-2xl font-bold text-[#00AEEF]">Epic Quests</p>
						<p className="text-sm text-gray-600">Placeholder</p>
					</div>
				</div>
				
				{/* CTA Button */}
				<div className={`flex gap-6 justify-center flex-wrap transition-opacity duration-700 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
					<Link 
						href="/map" 
						className="group relative px-10 py-5 bg-[#FF7A00] text-white font-bold text-xl rounded-2xl shadow-[8px_8px_0_#00AEEF] hover:shadow-[10px_10px_0_#00AEEF] transform hover:scale-105 transition-all duration-200 overflow-hidden"
					>
						<span className="relative z-10">Start Your Quest</span>
						<div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						<div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-90 transition-opacity duration-300 animate-pulse"></div>
						<div className="absolute -inset-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
					</Link>
				</div>

			</div>
		</div>
	);
}
