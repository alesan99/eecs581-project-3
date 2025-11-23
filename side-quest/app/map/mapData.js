/*
	Name: Map data
	Description: Defines the node map of the KU campus.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
	Input: None (static map def)
	Output: Map object containing campus nodes, quests, links, and background info
*/

import { useEffect, useState } from "react";


// Primary map configuration object
const SCALE = 1.5;
const initMapData = {
	// Canvas dimensions for the rendered map (virtual coordinates)
	width: 1669*SCALE,
	height: 1535*SCALE,
	// Node definitions: each represents a campus landmark or quest point
	nodes: [
		{
			id: "lee",
			x: 645*SCALE,
			y: 539*SCALE,
			label: "LEEP2",
			quests: [
				"Visit the LEEP Atrium.",
				"Visit the Nest.",
				"Find the balcony.",
				"See the boot guy.",
			]
		},
		{
			id: "chi",
			x: 812*SCALE,
			y: 487*SCALE,
			label: "Chi Omega Fountain",
			quests: [
				"Go for a swim in the fountain.",
			]
		},
		{
			id: "sum",
			x: 879*SCALE,
			y: 731*SCALE,
			label: "Summerfield Hall",
			quests: [
				"Use the sketchy small elevator.",
				"Find the movie theatre.",
				"Sit on the painted bench.",
			]
		},
	],

	// link pairs by id
	links: [
		// ["lee", "chi"],
		// ["lee", "eat"],
	],

	// Background image
	background: {
		src: "/map.png",
		width: 1669*SCALE,
		height: 1535*SCALE,
		opacity: 0.4,
	},
}


// Create map data by fetching locations and quests from backend
export function useMapData() {
	const [mapData, setMapData] = useState(initMapData);
	useEffect(() => {
		let mounted = true;

		async function load() {
			try {
				// Fetch quests and locations from backend
				const res = await fetch("/api/map");
				if (!res.ok) {
					console.error("mapData fetch failed", res.status);
					return;
				}
				const payload = await res.json();
				
				if (!Array.isArray(payload.locations) || !Array.isArray(payload.quests)) {
					// No locations or quests
					return;
				}
				const locations = payload.locations;
				const quests = payload.quests;

				// construct a node for each location
				const nodes = locations.map((location, i) => {
					// Get all quests for this location
					const locationQuests = quests.filter(q => q.location_id === location.location_id);
					console.log(quests, location);
					const questTexts = locationQuests.map(q => q.text ?? "");
					// Build dependencies
					const dependencies = {};
					locationQuests.forEach((q, i) => {
						if (q.dependency !== undefined && q.dependency !== null) {
							const depIndex = locationQuests.findIndex(dq => dq.quest_id === q.dependency);
							if (depIndex !== -1) {
								dependencies[i] = [depIndex];
							}
						}
					});

					return {
						id: location.name.slice(0,3).toLowerCase(),
						x: Number(location.x_coordinate ?? 0)*SCALE,
						y: Number(location.y_coordinate ?? 0)*SCALE,
						label: location.name ?? `Location ${loc.location_id}`,
						quests: questTexts,
						dependencies,
					};
				});

				// Preserve frontend background/size and fallback links
				const result = {
					width: initMapData.width,
					height: initMapData.height,
					background: initMapData.background,
					links: initMapData.links,
					nodes,
				};
				console.log(result)

				if (mounted) setMapData(result);
			} catch (err) {
				// on any error remain using initMapData
				console.error("Failed to load map info", err);
			}
		}

		load();
		return () => { mounted = false; };
	}, []);

	// Remove constructed map data
	return mapData;
}