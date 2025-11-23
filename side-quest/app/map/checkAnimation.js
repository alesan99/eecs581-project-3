/*
	Name: checkAnimation.js
	Description: An animation that plays when you complete a quest
	Programmers: Alejandro Sandoval
	Date: 11/22/2025
	Revisions: N/A
	Errors: N/A
	Input: Is animation active? Random see.
	Output: A quest completion animation with particles.
*/

export function QuestCheckAnimation({ active, seed = 0 }) {
	// Check if animation is active
	if (!active) return null;

	// Animation configuration
	// I made it a bunch of emojis
	const parts = 7;
	const emojis = ["🎉","✨","😄","😎","💫","💪","⚔️"];

	// randomness seed
	const rnd = (n) => Math.sin(seed + n) * 10000 % 1;

	// Return an explosion of emojis
	return (
		<div aria-hidden="true" className="absolute inset-0 pointer-events-none">
			{/* CSS styling to move emojis */}
			<style>{`
				.emoji-particle {
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%,-50%) scale(0.8);
					opacity: 1;
					font-size: 32px;
					will-change: transform, opacity;
					animation: node-burst 1800ms cubic-bezier(.18,.9,.28,1) forwards;
					filter: drop-shadow(0 6px 8px rgba(0,0,0,0.12));
				}
				@keyframes node-burst {
					0% { transform: translate(-50%,-50%) translate(0,0) scale(0.8); opacity: 1; }
					100% { transform: translate(-50%,-50%) translate(var(--tx), var(--ty)) scale(2.2); opacity: 0; }
				}
			`}</style>

			{Array.from({ length: parts }).map((_, i) => {
				// Determine random emoji explosion positions
				const angle = (i / parts) * 360 + (rnd(i) * 60 - 30); // get a random angle
				const distance = 150 + Math.round(rnd(i + 5) * 78); // distance moved plus modifier per emoji
				const tx = Math.round(Math.cos((angle * Math.PI) / 180) * distance); // calc x
				const ty = Math.round(Math.sin((angle * Math.PI) / 180) * distance); // calc y
				const delay = `${(i * 30) + (rnd(i) * 40)}ms`; // movement delay
				const emoji = emojis[(i + seed) % emojis.length]; // select random emoji
				// Return individual emojis
				return (
					<span
						key={i}
						className="emoji-particle"
						style={{
							["--tx"]: `${tx}px`,
							["--ty"]: `${ty}px`,
							animationDelay: delay,
							transformOrigin: "center",
						}}
					>
						{emoji}
					</span>
				);
			})}
		</div>
	);
}