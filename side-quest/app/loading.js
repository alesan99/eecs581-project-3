/*
	Name: loading.js
	Description: A loading animation that appears whenever a page is loading
	Programmers: Alejandro Sandoval
	Date: 11/22/2025
	Revisions: N/A
	Errors: N/A
	Input: Is page loading?
	Output: A spinning wheel loading animation.
*/

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div role="status" className="flex flex-col items-center gap-3">
		{/* Spinning wheel animation */}
        <div className="w-14 h-14 rounded-full border-4 border-t-4 border-black border-t-[#FF7A00] animate-spin" />
        {/* Loading text */}
		<span className="text-sm text-black">Loading…</span>
      </div>
    </div>
  );
}