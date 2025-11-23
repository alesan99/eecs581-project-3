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

// Primary map configuration object
export const mapData = {
	// Canvas dimensions for the rendered map (virtual coordinates)
	width: 2000,
	height: 3000,
	// Node definitions: each represents a campus landmark or quest point
	nodes: [
		{
			id: "a",
			x: 645,
			y: 539,
			label: "LEEP2",
			quests: [
				"Visit the LEEP Atrium.",
				"Visit the Nest.",
				"Find the balcony.",
				"See the boot guy,",
			]
		},
		{
			id: "b",
			x: 812,
			y: 487,
			label: "Chi Omega Fountain",
			quests: [
				"Go for a swim in the fountain.",
			]
		},
		{
			id: "c",
			x: 879,
			y: 731,
			label: "Summerfield Hall",
			quests: [
				"Use the sketchy small elevator.",
				"Find the movie theatre.",
				"Sit on the painted bench.",
			]
		},
		{
			id: "d",
			x: 1221,
			y: 459,
			label: "KU Memorial Union",
			quests: [
				"Take a selfie infront of the jayhawk statues.",
				"Play a board game on the bottom floor.",
				"Get food from the market.",
				"Find the ATMs.",
				"Attend a career fair.",
				"Get Chick-Fil-A",
			]
		},
		{
			id: "e",
			x: 991,
			y: 592,
			label: "Wescoe Hall",
			quests: [
				"Get free food in front of Wescoe.",
				"Get free food in front of Wescoe twice.",
				"Get free food in front of Wescoe three times.",
				"Find the vending machines in the underground.",
			],
			dependencies: {
				1: [0],
				2: [1],
				3: [2],
			}
		},
		{
			id: "f",
			x: 1032,
			y: 421,
			label: "Campanile",
			quests: [
				"Walk under the bell tower.",
			]
		},
		{
			id: "g",
			x: 1202,
			y: 531,
			label: "Natural History Museum",
			quests: [
				"See Comanche",
			]
		},
		{
			id: "h",
			x: 776,
			y: 673,
			label: "Murphy Hall",
			quests: [
				"Visit the courtyard",
				"Find the library",
			]
		},
		{
			id: "i",
			x: 883,
			y: 612,
			label: "Anshutz Library",
			quests: [
				"Find The Stacks.",
				"Collect a tiny duck.",
				"Visit the secret bottom floor.",
				"Take the sketchy back stairs"
			]
		},
		{
			id: "j",
			x: 903,
			y: 574,
			label: "Budig Hall",
			quests: [
				"Find the balcony",
			]
		},
		{
			id: "k",
			x: 710,
			y: 593,
			label: "Eaton Hall",
			quests: [
				"Try to find a working printer",
			]
		},
		{
			id: "l",
			x: 713,
			y: 820,
			label: "Allen Fieldhouse",
			quests: [
				"Go to a basketball game.",
				"Camp for a game.",
			]
		},
		{
			id: "m",
			x: 765,
			y: 611,
			label: "Slawson Hall",
			quests: [
				"Walk under the dinosaur fossil.",
				"Go up all the stairs without a break.",
				"Open the front doors in the correct direction.",
			]
		},
		{
			id: "n",
			x: 935,
			y: 402,
			label: "Potter Lake",
			quests: [
				"Jump in the lake.",
				"Sled down Potter hill when it snows.",
			]
		},
		{
			id: "o",
			x: 911,
			y: 516,
			label: "Snow Hall",
			quests: [
				"Go to the math help room",
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
		width: 1669,
		height: 1535,
		opacity: 0.4,
	},
}
