/*
	Name: signup/page.js
	Description: Page to prompt user to sign up.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Map, Compass, Backpack, UserPlus } from "lucide-react";

export default function SignupPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [err, setErr] = useState("");
	const router = useRouter();

	// Redirect to homepage if already logged in
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch("/api/auth/me", { credentials: "include" });
				if (!mounted) return;
				if (res.ok) {
					const { user } = await res.json();
					if (user) router.replace("/");
				}
			} catch (e) {
				// ignore network errors
			}
		})();
		return () => {
			mounted = false;
		};
	}, [router]);

	// Submit signup request
	async function submit(e) {
		e.preventDefault();
		setErr("");
		const res = await fetch("/api/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ name, email, password }),
		});
		if (res.ok) {
			// Proceed to map page
			router.push("/map");
			router.refresh();
		} else {
			// Show signup error
			const payload = await res.json();
			setErr(payload?.message || "Signup failed");
		}
	}

	return (
		<div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#FFF6D8] py-10">
			<div className="flex w-full max-w-5xl items-center justify-between p-10">
				{/* Left: Illustration Section */}
				<motion.div
					initial={{ x: -100, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.8 }}
					className="hidden md:flex flex-col justify-center text-left max-w-md"
				>
					<h1 className="text-6xl font-extrabold text-[#FF7A00] drop-shadow-[2px_2px_#FFDA00]">
						Start Your Adventure
					</h1>
					<p className="text-xl text-[#00AEEF] mt-4">
						Join fellow explorers on KU campus. Discover hidden gems, complete challenges, and climb the leaderboard.
					</p>
					<div className="mt-8 flex gap-4">
						<UserPlus className="w-10 h-10 text-[#00AEEF]" />
						<Backpack className="w-10 h-10 text-[#FF7A00]" />
						<Map className="w-10 h-10 text-[#00AEEF]" />
					</div>
				</motion.div>

				{/* Right: Signup Card */}
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="w-full md:w-[400px] bg-white border-4 border-[#00AEEF] rounded-3xl p-8 shadow-[8px_8px_0_#FF7A00]"
				>
					<h2 className="text-3xl font-bold text-center text-[#00AEEF] mb-6">
						Join Side Quest
					</h2>
					<form onSubmit={submit} className="flex flex-col gap-4">
						<input
							type="text"
							placeholder="Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="border-2 border-[#00AEEF] focus:border-[#FF7A00] rounded-xl px-4 py-3 text-gray-700 focus:outline-none"
							required
						/>
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="border-2 border-[#00AEEF] focus:border-[#FF7A00] rounded-xl px-4 py-3 text-gray-700 focus:outline-none"
							required
						/>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="border-2 border-[#00AEEF] focus:border-[#FF7A00] rounded-xl px-4 py-3 text-gray-700 focus:outline-none"
							required
						/>
						{err && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">{err}</div>}
						<button
							type="submit"
							className="bg-[#00AEEF] hover:bg-[#0096D6] text-white font-bold text-lg py-3 rounded-xl shadow-md mt-2 hover:scale-105 cursor-pointer transition-all duration-200"
						>
							Create Account
						</button>
					</form>

					<p className="text-center text-sm text-gray-700 mt-4">
						Already have an account?{" "}
						<Link href="/login" className="text-[#FF7A00] font-semibold hover:underline">
							Log in
						</Link>
					</p>
				</motion.div>
			</div>
		</div>
	);
}
