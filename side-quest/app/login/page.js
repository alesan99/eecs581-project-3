/*
	Name: login/page.js
	Description: Page to prompt user to log in.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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

	// Submit login request
	async function submit(e) {
		e.preventDefault();
		setErr("");
		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ email, password }),
		});
		if (res.ok) {
			// Proceed to map page
			router.push("/map");
			router.refresh();
		} else {
			// Show login error
			const payload = await res.json();
			setErr(payload?.message || "Login failed");
		}
	}

	return (
		<div className="max-w-md mx-auto p-8">
			<h2 className="text-2xl font-semibold mb-4">Login</h2>
			<form onSubmit={submit} className="flex flex-col gap-3">
				<div>
					<label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="email"
						className="input bg-white dark:bg-gray-800 w-full"
					/>
				</div>

				<div>
					<label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="password"
						className="input bg-white dark:bg-gray-800 w-full"
					/>
				</div>
				<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">Sign in</button>
				{err && <div className="text-red-600">{err}</div>}
			</form>
			<p className="text-sm mt-4">Sample users stored in data/users.json</p>
		</div>
	);
}