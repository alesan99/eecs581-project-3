/*
	Name: progress-bar.js
	Description: Animated progress bar component that visually fills from 0% to a target percentage when scrolled into view.
	Programmers: Pashia Vang
	Date: 10/26/2025
	Revisions: N/A
	Errors: N/A
	Input: 
		- percentage: Target progress value (0–100)
		- color (string): Bar fill color
		- shadowColor (string): Shadow color 
	Output: 
		- animated progress bar
		- Optional sparkle effect when progress reaches 100%
*/


"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

/*
	Component: AnimatedProgressBar
	Description: Progress bar that animates from 0% to target percentage when scrolled into view.
	Props:
		percentage - The target percentage (0-100)
		color - The border color for the progress bar
		shadowColor - The shadow color (not used but kept for consistency)
*/
export default function AnimatedProgressBar({ percentage, color, shadowColor }) {
	const [animatedPercentage, setAnimatedPercentage] = useState(0);
	const [hasAnimated, setHasAnimated] = useState(false);
	const progressRef = useRef(null);

	useEffect(() => {
		if (hasAnimated) return; // Only animate once

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !hasAnimated) {
						// Start animation when element comes into view
						setHasAnimated(true);
						
						// Animate from 0 to target percentage
						let current = 0;
						const increment = percentage / 30; // 30 frames for smooth animation
						const duration = 800; // 800ms total duration
						const frameTime = duration / 30;

						const interval = setInterval(() => {
							current += increment;
							if (current >= percentage) {
								current = percentage;
								clearInterval(interval);
							}
							setAnimatedPercentage(current);
						}, frameTime);
					}
				});
			},
			{
				threshold: 0.2, // Trigger when 20% of the element is visible
			}
		);

		if (progressRef.current) {
			observer.observe(progressRef.current);
		}

		return () => {
			if (progressRef.current) {
				observer.unobserve(progressRef.current);
			}
		};
	}, [percentage, hasAnimated]);

	return (
		<div 
			ref={progressRef}
			className="mb-6 h-5 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200"
		>
			<div 
				className="h-full transition-all duration-700 rounded-full relative"
				style={{ 
					width: `${animatedPercentage}%`,
					backgroundColor: color,
					transition: 'width 0.05s ease-out'
				}}
			>
				{animatedPercentage === percentage && percentage === 100 && (
					<div className="absolute inset-0 flex items-center justify-center">
						<Sparkles className="w-4 h-4 text-white animate-pulse" />
					</div>
				)}
			</div>
		</div>
	);
}

