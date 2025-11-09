/*
	Name: node.js
	Description: Definition of node components.
	Programmers: Alejandro Sandoval, Pashia Vang
	Date: 10/25/2025
	Revisions: Add progress bars - 11/06/2025
	Errors: N/A
	Input: Node data object, user interaction handlers, quest completion info
	Output: Node component & displaying progress & interactive quests
*/

"use client";

export function Node({ node, onPointerDown, onClick, completedCount = 0, totalCount = 0 }) {
	/*
		Name: Node component
	Description
	Arguments: 
		node: node properies
		onPointerDown: function
		onClick: function
		completedCount: number of completed quests at this location
		totalCount: total number of quests at this location
	Returns:
		component
	*/
	const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
	const isComplete = completedCount > 0 && completedCount === totalCount;
	
	// Determine node color based on completion
	let nodeColor = 'bg-blue-600';
	if (isComplete) {
		nodeColor = 'bg-green-600';
	} else if (completedCount > 0) {
		nodeColor = 'bg-yellow-600';
	}

	// Calculate circumference for progress ring (for SVG circle)
	const radius = 20;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;

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
				{/* Progress ring container - fixed size to ensure proper alignment */}
				<div className="relative w-12 h-12 flex items-center justify-center">
					{/* SVG Progress Ring - centered behind the node */}
					<svg 
						className="absolute" 
						width="44" 
						height="44"
						style={{ 
							left: '50%',
							top: '50%',
							transform: 'translate(-50%, -50%) rotate(-90deg)',
							filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
						}}
					>
						{/* Background circle */}
						<circle
							cx="22"
							cy="22"
							r={radius}
							fill="none"
							stroke="#e5e7eb"
							strokeWidth="3"
						/>
						{/* Progress circle */}
						{percentage > 0 && (
							<circle
								cx="22"
								cy="22"
								r={radius}
								fill="none"
								stroke={isComplete ? "#10b981" : "#f59e0b"}
								strokeWidth="3"
								strokeDasharray={circumference}
								strokeDashoffset={strokeDashoffset}
								strokeLinecap="round"
								className="transition-all duration-500 ease-out"
							/>
						)}
					</svg>
					{/* Node circle with letter - centered */}
					<div className={`w-9 h-9 rounded-full ${nodeColor} text-white flex items-center justify-center shadow-lg relative z-10 transition-colors duration-300`}>
						{node.label[0]}
					</div>
					{/* Progress badge - positioned at bottom right of the container */}
					{totalCount > 0 && (
						<div className={`absolute bottom-0 right-0 rounded-full px-1.5 py-0.5 text-xs font-bold shadow-md z-20 transform translate-x-1/4 translate-y-1/4 ${
							isComplete 
								? 'bg-green-500 text-white' 
								: completedCount > 0 
									? 'bg-yellow-500 text-white' 
									: 'bg-gray-400 text-white'
						}`}>
							{completedCount}/{totalCount}
						</div>
					)}
				</div>
			</div>
			<div className="absolute left-0 top-full mt-8 -translate-x-1/2 transform w-28 text-sm text-center text-gray-700 dark:text-gray-200">
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

	// Calculate progress
	const completedCount = Object.values(toggles).filter(v => v === true).length;
	const totalCount = node.quests.length;
	const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
	const isComplete = completedCount > 0 && completedCount === totalCount;

	return (
		<div className="absolute z-50 bg-white dark:bg-gray-800 border rounded p-4 shadow-md w-64 cursor-default" style={{ left: dialogLeft, top: dialogTop }}>
			<div className="flex justify-between items-center mb-2">
				<div className="font-semibold">{node.label}</div>
				<button onClick={onClose} className="text-sm px-2 py-1 border rounded cursor-pointer">Close</button>
			</div>

			{/* Progress indicator */}
			<div className="mb-3">
				<div className="flex items-center justify-between mb-1">
					<span className="text-xs text-gray-600 dark:text-gray-300">Progress</span>
					<span className={`text-xs font-bold ${
						isComplete ? 'text-green-600' : completedCount > 0 ? 'text-yellow-600' : 'text-gray-600'
					}`}>
						{completedCount} / {totalCount} ({percentage}%)
					</span>
				</div>
				{/* Progress bar */}
				<div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
					<div 
						className={`h-full transition-all duration-300 ${
							isComplete ? 'bg-green-500' : completedCount > 0 ? 'bg-yellow-500' : 'bg-gray-400'
						}`}
						style={{ width: `${percentage}%` }}
					/>
				</div>
			</div>

			<div className="mb-2 text-sm text-gray-600 dark:text-gray-300">Quests</div>
			<div className="flex flex-col gap-2">
				{node.quests.map((opt, i) => {
					// Is quest checked off?
					const isCompleted = !!toggles?.[opt];

					// Check dependencies
					let deps = [];
					if (node.dependencies && node.dependencies[i] !== undefined) {
						deps = [node.dependencies[i]]; // see if dependencies are defined.
					}
                    const depsSatisfied = deps.every(index => {
						// Check to make sure all quests in dependencies are checked off.
                        const quest = node.quests[index];
                        return !!toggles?.[quest];
                    });
                    const disabled = deps.length > 0 && !depsSatisfied; // Should the checkbox be disabled?

					return (
						<label 
							key={opt} 
							className={`flex items-center gap-2 p-2 rounded transition-colors ${
								isCompleted ? 'bg-green-50 dark:bg-green-900/20' : ''
							}`}
						>
							<input 
								type="checkbox"
								checked={isCompleted} 
                                disabled={disabled}
								onChange={() => onToggle(opt)} 
								className="cursor-pointer"
							/>
							<span className={`text-sm ${isCompleted ? 'line-through text-gray-500' : ''}`}>
								{opt}
							</span>
						</label>
					);
				})}
			</div>
		</div>
	);
}
