/*
	Name: Map data
	Description: Defines the node map of the KU campus.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/

export const mapData = {
	width: 2000,
	height: 3000,

	nodes: [
		{
			id: "a",
			x: 161,
			y: 359,
			label: "LEEP2",
			quests: [
				"Visit the LEEP Atrium.",
				"Visit the Nest.",
				"Find the balcony.",
			]
		},
		{
			id: "b",
			x: 437,
			y: 240,
			label: "Chi Omega Fountain",
			quests: [
				"Go inside the fountain.",
			]
		},
		{
			id: "c",
			x: 545,
			y: 600,
			label: "Summerfield Hall",
			quests: [
				"Use the sketchy small elevator.",
				"Find the movie theatre.",
				"Sit on the painted bench.",
			]
		},
		{
			id: "d",
			x: 1133,
			y: 161,
			label: "KU Memorial Union",
			quests: [
				"Play a board game on the bottom floor.",
				"Get food from the market.",
				"Find the ATMs",
			]
		},
	],

	// link pairs by id
	links: [
		["a", "b"],
		["a", "c"],
		["b", "d"],
		["c", "d"],
	],

	// Background image
	background: {
		src: "/map.png",
		width: 1346,
		height: 760,
		opacity: 0.2,
	},
}