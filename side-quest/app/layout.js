/*
	Name: layout.js
	Description: Defines common styles used across all pages in the app.
	Programmers: Aiden Barnard, Alejandro Sandoval, Pashia Vang
	Date: 10/25/2025
	Revisions: 
		Add notifications - 11/06/2025
		Add welcome modal - 11/09/2025
		Additional comments - 11/23/2025
	Errors: N/A
	Input:
		Style request from page
	Output:
		Root layout style
		Fonts
*/

// Fonts: imported via Next's font helper for optimized loading and CSS vars.
import { Geist, Geist_Mono } from "next/font/google";

// Global stylesheet applied across the app
import "./globals.css";

// App chrome: top toolbar and page-level providers
import Toolbar from "./components/toolbar";
import { NotificationProvider } from "./contexts/NotificationContext";
import WelcomeModal from "./components/welcome-modal";

// Project Description //
// Metadata: used by Next for the document head and SEO
export const metadata = {
	title: "Side Quest",
	description: "An app that gives fun campus challenges and tracks your progress.",
};

// Fonts: configure font variables that are applied on the <body> element.
// The `variable` option exposes a CSS custom property so components can
// reference the loaded font families (useful for mixing typefaces).
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
	/*
		Root layout composes the top-level app chrome and providers.
		- `NotificationProvider` makes in-app notifications available to descendants.
		- `Toolbar` renders the site navigation and auth controls.
		- `WelcomeModal` shows a one-time onboarding modal for new users.
		- The font CSS variables are applied on `<body>` so all components
		  can inherit the chosen typefaces.
	*/
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
			>
				{/*
					App Providers: wrap the chrome and page content so that
					any page/component can access notifications and global state.
				*/}
				<NotificationProvider>
					{/* Top navigation and global UI elements */}
					<Toolbar/>

					{/* One-time welcome modal handled client-side */}
					<WelcomeModal />

					{/*
						Main content container: `flex-1` ensures it expands to
						fill vertical space while toolbar and modal sit above it.
					*/}
					<main className="flex-1 flex flex-col">
						{children}
					</main>
				</NotificationProvider>
			</body>
		</html>
	);
}
