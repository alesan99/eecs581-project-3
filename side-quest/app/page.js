/*
	Name: page.js
	Description: Main landing page.
	Programmers: Aidan Barnard, Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<div className="max-w-4xl mx-auto p-8">
			<h1 className="text-3xl font-bold mb-4">Welcome to Side Quest</h1>
			<p className="mb-6">Open the map to start. Use the toolbar to navigate.</p>
			<div className="flex gap-3">
				<Link href="/map" className="px-4 py-2 bg-blue-600 text-white rounded">Open Map</Link>
				<Link href="/login" className="px-4 py-2 border rounded">Login</Link>
			</div>
		</div>
	);
}
