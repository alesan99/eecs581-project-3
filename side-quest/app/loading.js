/*
	Name: loading.js
	Description: A loading animation that appears whenever a page is loading
	Programmers: Alejandro Sandoval, Aiden
	Date: 11/22/2025
	Revisions: Added some comments (Aiden) 11/23/2025
	Errors: N/A
	Input: Is page loading?
	Output: A spinning wheel loading animation.
*/

export default function Loading() {
	// Full-screen overlay: fixed positioning keeps this centered over the
	// current page, and a high z-index ensures it appears above other content.
	// This wrapper blocks user interaction visually while an operation completes.
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/*
				Status container: `role="status"` signals assistive technologies that
				this region provides a status update. Screen readers will announce the
				presence of status text (the "Loading…" span) when appropriate.
			*/}
			<div role="status" className="flex flex-col items-center gap-3">
		{/*
			Spinner: created by drawing a circular border and coloring only the
			-top segment (`border-t-...`) so that CSS rotation (Tailwind's
			`animate-spin`) produces the classic spinner effect.
		*/}
				<div className="w-14 h-14 rounded-full border-4 border-t-4 border-black border-t-[#FF7A00] animate-spin" />

		{/*
			Visible status text for sighted users. Kept as a simple inline label
			so both screen-reader users and sighted users understand the current
			state; the `role="status"` wrapper is what exposes this to AT.
		*/}
				<span className="text-sm text-black">Loading…</span>
			</div>
		</div>
	);
}