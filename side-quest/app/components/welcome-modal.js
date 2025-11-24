"use client";

/*
	Name: welcome-modal.js
	Description: Displays a one-time welcome modal for newly registered users.
	Programmers: Pashia Vang
	Date: 11/09/2025
	Revisions: Trigger re-check on route change - 11/09/2025
	Errors: N/A
	Input: None directly; fetches welcome state from /api/welcome
	Output: Themed welcome modal that appears once for new users
*/

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

export default function WelcomeModal() {
	// State to track whether the modal should be displayed
	const [shouldShow, setShouldShow] = useState(false);
	// Loading state while fetching welcome status
	const [loading, setLoading] = useState(true);
	// State to prevent multiple dismiss calls
	const [dismissing, setDismissing] = useState(false);
		// Get the current pathname to trigger re-check when route changes
	const pathname = usePathname();

	// Effect: check welcome status whenever the pathname changes
	useEffect(() => {
		let mounted = true;
		setLoading(true);

		async function checkWelcomeStatus() {
			try {
				// GET request to server to check if welcome modal should be shown
				const res = await fetch("/api/welcome", { credentials: "include" });
				if (!mounted) return;

				if (!res.ok) {
					// If response is not ok, hide modal
					setShouldShow(false);
					return;
				}

				const data = await res.json();
				// Show modal only if data.show is true
				setShouldShow(Boolean(data?.show));
			} catch (error) {
				// On network or fetch errors, do not show modal
				if (mounted) setShouldShow(false);
			} finally {
				if (mounted) setLoading(false);
			}
		}

		checkWelcomeStatus();

		// Cleanup function to prevent state updates after unmount
		return () => {
			mounted = false;
		};
	}, [pathname]);

	const dismiss = useCallback(async () => {
		if (dismissing) return;
		setDismissing(true);
		setShouldShow(false);

		try {
			// Notify server that modal has been seen
			await fetch("/api/welcome", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ seen: true }),
				credentials: "include",
			});
		} catch {
			// Ignored; the modal is already closed client-side.
		} finally {
			setDismissing(false);
		}
	}, [dismissing]);
	// If still loading or modal shouldn't be shown, render nothing
	if (loading || !shouldShow) {
		return null;
	}

	// Render modal overlay
	return (
		<div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
			<div className="relative w-full max-w-lg bg-white rounded-3xl border-4 border-[#FF7A00] shadow-[14px_14px_0_#00AEEF] p-8 text-center">
				<button
					type="button"
					onClick={dismiss}
					className="absolute -top-5 -right-5 w-12 h-12 rounded-full bg-white border-2 border-[#FF7A00] text-[#FF7A00] flex items-center justify-center shadow-lg transition-all duration-200 hover:bg-[#FF7A00] hover:text-white cursor-pointer"
					aria-label="Close welcome message"
				>
					<X className="w-6 h-6" />
				</button>

				<p className="text-sm uppercase tracking-[0.3em] text-[#00AEEF] font-semibold mb-4">
					Welcome Explorer
				</p>
				<h2 className="text-4xl font-black text-[#FF7A00] drop-shadow-[3px_3px_0_#FFD84D] mb-4">
					Your Side Quest Begins Now!
				</h2>
				<p className="text-gray-700 leading-relaxed mb-6">
					Thanks for joining Side Quest. Tap into the campus map, uncover hidden gems, and complete challenges to climb the leaderboard. Ready to start your adventure?
				</p>
				<button
					type="button"
					onClick={dismiss}
					className="px-8 py-3 bg-[#00AEEF] text-white font-bold text-lg rounded-xl shadow-md hover:bg-[#0096D6] transition-colors duration-200 cursor-pointer"
				>
					Let&apos;s Explore
				</button>
			</div>
		</div>
	);
}

