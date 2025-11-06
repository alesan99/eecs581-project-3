/*
	Name: map/page.js
	Description: Map viewing page. Main map interface for tracking quest progress.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/

"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { mapData } from "./mapData";
import { Node, NodeDialog } from "./node";

/*
	Component: MapPage
	Description:
		Top-level page wrapper for the interactive campus map. 
		Hosts the main MapCanvas component that manages map state and user interactions.
*/
export default function MapPage() {
	return (
		<div className="page flex-1 flex flex-col w-full">
			<MapCanvas />
		</div>
	);
}

/*
	Component: MapCanvas
	Description:
		Handles the rendering and interaction logic for the map view, including:
			- Panning behavior
			- Node selection and quest toggles
			- Displaying node connections and map background
		Uses React refs and event handlers for performance and state management.
*/
function MapCanvas() {
	const containerRef = useRef(null);

	// Static map data
	const [nodes] = useState(mapData.nodes);

	// Currently selected node (for dialog display)
	const [selectedId, setSelectedId] = useState(null);

	// Track per-node quest completion states
	const [nodeToggles, setNodeToggles] = useState(() =>
		Object.fromEntries(
			nodes.map(n => [n.id, Object.fromEntries(n.quests.map(opt => [opt, false]))])
		)
	);

	// Loading state for progress
	const [loadingProgress, setLoadingProgress] = useState(true);

	// Panning state
	const [pan, setPan] = useState({ x: 0, y: 0 });
	const [isPanning, setIsPanning] = useState(false);
	const isPanningRef = useRef(false);
	const lastRef = useRef({ x: 0, y: 0 });
	const movedRef = useRef(false);

	// Center initial view on first node
	useEffect(() => {
		const start = nodes[0];
		const c = containerRef.current;
		if (c && start) {
			setPan({
				x: c.clientWidth / 2 - start.x,
				y: c.clientHeight / 2 - start.y,
			});
		}
	}, [nodes]);

	// Load progress from database on mount
	useEffect(() => {
		async function loadProgress() {
			try {
				const response = await fetch("/api/progress");
				if (!response.ok) {
					// If unauthorized, user is not logged in - that's okay, just use default state
					if (response.status === 401) {
						setLoadingProgress(false);
						return;
					}
					throw new Error("Failed to load progress");
				}
				const data = await response.json();
				const progress = data.progress || {};

				// Map database progress to node toggles
				const newToggles = Object.fromEntries(
					nodes.map(n => [
						n.id,
						Object.fromEntries(
							n.quests.map(questText => {
								const locationName = n.label;
								const locationProgress = progress[locationName] || {};
								const questProgress = locationProgress[questText];
								return [questText, questProgress?.completed || false];
							})
						)
					])
				);

				setNodeToggles(newToggles);
			} catch (error) {
				console.error("Error loading progress:", error);
				// Continue with default state if loading fails
			} finally {
				setLoadingProgress(false);
			}
		}

		loadProgress();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run on mount

	/* ====== Pointer Event Handlers (for map dragging/panning) ====== */

	function onPointerDown(e) {
		if (e.button !== 0) return; // left mouse only
		if (e.target !== containerRef.current) return;
		isPanningRef.current = true;
		setIsPanning(true);
		movedRef.current = false;
		lastRef.current = { x: e.clientX, y: e.clientY };
		containerRef.current.setPointerCapture(e.pointerId);
	}

	function onPointerMove(e) {
		if (!isPanningRef.current) return;
		const dx = e.clientX - lastRef.current.x;
		const dy = e.clientY - lastRef.current.y;

		// Mark as "moved" if drag distance exceeds threshold
		if (Math.abs(dx) > 2 || Math.abs(dy) > 2) movedRef.current = true;

		lastRef.current = { x: e.clientX, y: e.clientY };
		setPan(p => ({ x: p.x + dx, y: p.y + dy }));
	}

	function onPointerUp(e) {
		if (!isPanningRef.current) return;
		isPanningRef.current = false;
		setIsPanning(false);
		movedRef.current = false;
		try {
			containerRef.current.releasePointerCapture(e.pointerId);
		} catch {
			// ignore release errors
		}
	}

	/* ====== Node Event Handlers ====== */

	function onNodePointerDown(e) {
		// Prevent node interactions from starting a pan
		e.stopPropagation();
	}

	function onNodeClick(id) {
		// Ignore click if user just panned
		if (movedRef.current) {
			movedRef.current = false;
			return;
		}
		setSelectedId(id);
	}

	async function toggleOption(nodeId, option) {
		// Find the node to get location name
		const node = nodes.find(n => n.id === nodeId);
		if (!node) return;

		// Get current completion state
		const currentState = nodeToggles[nodeId]?.[option] || false;
		const newState = !currentState;

		// Optimistically update UI
		setNodeToggles(prev => ({
			...prev,
			[nodeId]: { ...prev[nodeId], [option]: newState },
		}));

		// Save to database
		try {
			const response = await fetch("/api/progress", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					location_name: node.label,
					quest_text: option,
					completed: newState,
				}),
			});

			if (!response.ok) {
				// If save fails, revert the optimistic update
				if (response.status === 401) {
					console.warn("User not logged in, progress not saved");
					return;
				}
				throw new Error("Failed to save progress");
			}
		} catch (error) {
			console.error("Error saving progress:", error);
			// Revert optimistic update on error
			setNodeToggles(prev => ({
				...prev,
				[nodeId]: { ...prev[nodeId], [option]: currentState },
			}));
		}
	}

	function closeDialog() {
		setSelectedId(null);
	}

	// Helper: find node by id
	const findNode = id => nodes.find(n => n.id === id);

	/* ====== Render ====== */

	return (
		<div
			ref={containerRef}
			className={`relative w-full h-full ${
				isPanning ? "cursor-grabbing" : "cursor-grab"
			} bg-gray-50 dark:bg-gray-900 overflow-hidden border rounded`}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
		>
			{/* Panned map content container */}
			<div
				className="absolute top-0 left-0"
				style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
			>
				{/* Background map image */}
				<div
					className="absolute top-0 left-0 pointer-events-none select-none"
					style={{
						zIndex: 0,
						width: mapData.background.width,
						height: mapData.background.height,
						opacity: mapData.background.opacity ?? 1,
					}}
				>
					<Image
						src={mapData.background.src}
						width={mapData.background.width}
						height={mapData.background.height}
						alt="map background"
						priority
						unoptimized
					/>
				</div>

				{/* Render node connection lines */}
				<svg
					width={mapData.width}
					height={mapData.height}
					className="absolute top-0 left-0 pointer-events-none"
					style={{ overflow: "visible" }}
				>
					<g>
						{mapData.links.map(([a, b]) => {
							const na = findNode(a);
							const nb = findNode(b);
							if (!na || !nb) return null;
							return (
								<line
									key={`${a}-${b}`}
									x1={na.x}
									y1={na.y}
									x2={nb.x}
									y2={nb.y}
									stroke="#94a3b8"
									strokeWidth={2}
									strokeLinecap="round"
								/>
							);
						})}
					</g>
				</svg>

				{/* Render map nodes */}
				{nodes.map(n => (
					<Node
						key={n.id}
						node={n}
						onPointerDown={onNodePointerDown}
						onClick={() => onNodeClick(n.id)}
					/>
				))}
			</div>

			{/* Display dialog for selected node */}
			{selectedId && (
				<NodeDialog
					node={findNode(selectedId)}
					containerRef={containerRef}
					pan={pan}
					toggles={nodeToggles[selectedId]}
					onToggle={opt => toggleOption(selectedId, opt)}
					onClose={closeDialog}
				/>
			)}
		</div>
	);
}
