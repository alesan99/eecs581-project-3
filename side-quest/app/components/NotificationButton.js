/*
	Name: NotificationButton.js
	Description: Renders a bell button showing unread notifications and a dropdown list of notifications.
	Programmers: Pashia Vang
	Date: 11/06/2025
	Revisions: N/A
	Errors: N/A
	Input: Notifications from context
	Output: showing dropdown list of notifications
*/


"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCircle2, Info, AlertCircle, XCircle } from "lucide-react";
import { useNotifications } from "../contexts/NotificationContext";

export default function NotificationButton() {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const { notifications, removeNotification, clearAll } = useNotifications();

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		}

		if (isOpen) { // only listen for event if notif is open.
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const unreadCount = notifications.length;

	// Get Icon based on notification type
	const getIcon = (type) => {
		switch (type) {
			case "success":
				return <CheckCircle2 className="w-5 h-5 text-green-500" />;
			case "warning":
				return <AlertCircle className="w-5 h-5 text-yellow-500" />;
			case "error":
				return <XCircle className="w-5 h-5 text-red-500" />;
			default:
				return <Info className="w-5 h-5 text-blue-500" />;
		}
	};

	// Get background color based on notification type
	const getBgColor = (type) => {
		switch (type) {
			case "success":
				return "bg-green-50 border-green-300";
			case "warning":
				return "bg-yellow-50 border-yellow-300";
			case "error":
				return "bg-red-50 border-red-300";
			default:
				return "bg-blue-50 border-blue-300";
		}
	};

	return (
		<div className="relative" ref={dropdownRef}>
			{/* Notification Bell Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative p-2 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center justify-center group"
				title="Notifications"
			>
				<Bell className="w-6 h-6 group-hover:scale-110 transition-transform" />
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-[#FF7A00] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
						{unreadCount > 9 ? "9+" : unreadCount}
					</span>
				)}
			</button>

			{/* Dropdown */}
			{isOpen && (
				<div className="absolute right-0 mt-3 w-[22rem] max-h-[26rem] rounded-3xl bg-white/95 shadow-[6px_8px_0_rgba(0,0,0,0.12)] border-4 border-[#00AEEF] overflow-hidden z-50 backdrop-blur-lg animate-[fadeIn_0.25s_ease-out]">
					{/* Header */}
					<div className="relative flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#00AEEF] to-[#0096D6]">
						<div className="flex flex-col text-left text-white">
							<span className="text-xs uppercase tracking-[0.35em] opacity-80">Activity Feed</span>
							<h3 className="text-xl font-black drop-shadow-[2px_2px_0_rgba(0,0,0,0.18)]">Notifications</h3>
						</div>
						{notifications.length > 0 && (
							<button
								onClick={clearAll}
								className="text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/50 text-white/80 hover:text-white hover:border-white transition-all duration-150"
							>
								Clear
							</button>
						)}
						<div className="absolute -bottom-6 right-6 w-12 h-12 bg-white/40 blur-2xl rounded-full pointer-events-none" />
					</div>

					{/* Notifications List */}
					<div className="relative overflow-y-auto max-h-[20rem] px-3 py-4 bg-[radial-gradient(circle_at_top,#E0F2FF,transparent_70%)]">
						{notifications.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-gray-400">
								<Bell className="w-14 h-14 mb-3 text-[#00AEEF]/40" />
								<p className="text-sm font-semibold">All caught up!</p>
								<p className="text-xs text-gray-400/80 mt-1">We’ll drop new quests here.</p>
							</div>
						) : (
							<div className="space-y-3">
								{notifications.map((notification) => (
									<div
										key={notification.id}
										className={`group relative p-4 rounded-2xl border-[3px] shadow-[6px_6px_0_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[10px_12px_0_rgba(0,0,0,0.18)] ${getBgColor(notification.type)}`}
									>
										<div className="flex items-start gap-3">
											<div className="flex-shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(255,255,255,0.65)]">
												{getIcon(notification.type)}
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-semibold text-gray-800 leading-tight">
													{notification.message}
												</p>
												<p className="text-xs text-gray-500 mt-2 uppercase tracking-[0.2em]">
													{notification.timestamp.toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</p>
											</div>
											<button
												onClick={() => removeNotification(notification.id)}
												className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full border border-transparent hover:border-gray-300 hover:bg-white/70"
											>
												<X className="w-4 h-4 text-gray-400" />
											</button>
										</div>
										<div className="absolute -bottom-2 left-6 w-16 h-4 bg-white/60 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

