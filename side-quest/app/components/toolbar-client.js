"use client";

import Link from "next/link";
import { Map, Compass, Trophy, User, LogOut } from "lucide-react";

/*
	Component: ToolbarClient
	Description:
		Responsive navigation bar that adapts based on authentication state.
		Displays app branding, links to Map, Quests, Leaderboard, and Account pages.
		Shows login button if no user, or user info + logout button if authenticated.
	Props:
		user - Object representing the current user (name, email)
	Returns:
		JSX element for toolbar
*/
export default function ToolbarClient({ user }) {
	return (
		<nav className="sticky top-0 z-50 flex items-center justify-between bg-gradient-to-r from-[#00AEEF] to-[#0096D6] text-white px-8 py-4 shadow-lg">
			<Link 
				href="/" 
				className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95"
			>
				<div className="relative">
					<Map className="w-8 h-8 text-[#FFDA00] drop-shadow-lg group-hover:rotate-[-12deg] transition-transform duration-300" />
					<div className="absolute inset-0 bg-[#FFDA00] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
				</div>
				<span className="text-3xl font-extrabold drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] tracking-tight">
					<span className="text-white group-hover:text-[#FFDA00] transition-colors duration-200">
						Side
					</span>
					<span className="text-[#FFDA00] group-hover:text-white transition-colors duration-200">
						{" "}Quest
					</span>
				</span>
			</Link>
			
			{/* Navigation Links - Always visible */}
			<div className="hidden md:flex gap-6 text-lg font-semibold">
				<Link 
					href="/map" 
					className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 hover:text-[#FFDA00] transition-all duration-200 hover:scale-105"
				>
					<Map className="w-5 h-5 group-hover:scale-110 transition-transform" /> Map
				</Link>
				<Link 
					href="/quests" 
					className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 hover:text-[#FFDA00] transition-all duration-200 hover:scale-105"
				>
					<Compass className="w-5 h-5 group-hover:scale-110 transition-transform" /> Quests
				</Link>
				<Link 
					href="/leaderboard" 
					className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 hover:text-[#FFDA00] transition-all duration-200 hover:scale-105"
				>
					<Trophy className="w-5 h-5 group-hover:scale-110 transition-transform" /> Leaderboard
				</Link>
				<Link 
					href="/account" 
					className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 hover:text-[#FFDA00] transition-all duration-200 hover:scale-105"
				>
					<User className="w-5 h-5 group-hover:scale-110 transition-transform" /> Account
				</Link>
			</div>

			{/* Auth Section */}
			<div className="flex items-center gap-3">
				{user ? (
					<>
						<div className="hidden sm:flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
							<User className="w-4 h-4" />
							<span>{user.name || user.email}</span>
						</div>
						<form action="/api/auth/logout" method="post">
							<button 
								type="submit" 
								className="bg-transparent hover:bg-[#00AEEF] text-white p-3 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center group"
								title="Logout"
							>
								<LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
							</button>
						</form>
					</>
				) : (
					// Login button for unauthorized users
					<Link 
						href="/login" 
						className="bg-[#FF7A00] hover:bg-[#FF9500] text-white font-semibold px-5 py-2 rounded-lg transition-all duration-200 hover:scale-105"
					>
						Login
					</Link>
				)}
			</div>
		</nav>
	);
}
