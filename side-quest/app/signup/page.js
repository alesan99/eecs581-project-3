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
		<div className="max-w-md mx-auto p-8">
			<h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
			<form onSubmit={submit} className="flex flex-col gap-3">
				<div>
					<label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
					<input
						id="name"
						name="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="name"
						className="input bg-white dark:bg-gray-800 w-full"
						required
					/>
				</div>

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
						required
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
						required
					/>
				</div>
				<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">Sign up</button>
				{err && <div className="text-red-600">{err}</div>}
			</form>
			<p className="text-sm mt-4">
				Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
			</p>
		</div>
	);
}
