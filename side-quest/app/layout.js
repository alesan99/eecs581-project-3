/*
	Name: layout.js
	Description: Defines common styles used across all pages in the app.
	Programmers: Aiden Barnard, Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Toolbar from "./components/toolbar";
import { NotificationProvider } from "./contexts/NotificationContext";

// Project Description //
export const metadata = {
	title: "Side Quest",
	description: "An app that gives fun campus challenges and tracks your progress.",
};

// Fonts //
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

// Root Layout //
/*
	This will be used as the root across all pages in the app.
*/
export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
			>
				<NotificationProvider>
					<Toolbar/>
					<main className="flex-1 flex flex-col">
						{children}
					</main>
				</NotificationProvider>
			</body>
		</html>
	);
}
