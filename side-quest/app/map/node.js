/*
	Name: node.js
	Description: Definition of node components.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/

"use client";

export function Node({ node, onPointerDown, onClick }) {
	/*
		Name: Node component
	Description
	Arguments: 
		node: node properies
		onPointerDown: function
		onClick: function
	Returns:
		component
	*/
	return (
		<div
			onPointerDown={onPointerDown}
			onClick={onClick}
			className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none"
			style={{ left: node.x, top: node.y }}
			role="button"
			aria-label={node.label}
		>
			<div className="absolute left-0 top-0 transform -translate-x-1/2 -translate-y-1/2">
				<div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
					{node.label[0]}
				</div>
			</div>
			<div className="absolute left-0 top-full mt-2 -translate-x-1/2 transform w-28 text-sm text-center text-gray-700 dark:text-gray-200">
				{node.label}
			</div>
		</div>
	);
}

export function NodeDialog({ node, containerRef, pan, toggles = {}, onToggle, onClose }) {
	if (!node) return null;
	
	// Compute dialog position relative to the map container
	const screenX = node.x + (pan?.x || 0);
	const screenY = node.y + (pan?.y || 0);
	const cw = containerRef.current?.clientWidth || 800;
	const ch = containerRef.current?.clientHeight || 400;
	// Clamp dialog to container bounds to prevent overflow
	const dialogLeft = Math.max(12, Math.min(cw - 280, screenX));
	const dialogTop = Math.max(12, Math.min(ch - 220, screenY));

	return (
		<div className="absolute z-50 bg-white dark:bg-gray-800 border rounded p-4 shadow-md w-64 cursor-default" style={{ left: dialogLeft, top: dialogTop }}>
			<div className="flex justify-between items-center mb-2">
				<div className="font-semibold">{node.label}</div>
				<button onClick={onClose} className="text-sm px-2 py-1 border rounded cursor-pointer">Close</button>
			</div>

			<div className="mb-2 text-sm text-gray-600 dark:text-gray-300">Quests</div>
			<div className="flex flex-col gap-2">
				{node.quests.map(opt => (
					<label key={opt} className="flex items-center gap-2">
						<input type="checkbox" checked={!!toggles?.[opt]} onChange={() => onToggle(opt)} />
						<span className="text-sm">{opt}</span>
					</label>
				))}
			</div>
		</div>
	);
}
