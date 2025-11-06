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

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const unreadCount = notifications.length;

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

	const getBgColor = (type) => {
		switch (type) {
			case "success":
				return "bg-green-50 border-green-200";
			case "warning":
				return "bg-yellow-50 border-yellow-200";
			case "error":
				return "bg-red-50 border-red-200";
			default:
				return "bg-blue-50 border-blue-200";
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
				<div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#00AEEF] to-[#0096D6]">
						<h3 className="text-white font-bold text-lg">Notifications</h3>
						{notifications.length > 0 && (
							<button
								onClick={clearAll}
								className="text-white hover:text-[#FFDA00] text-sm font-semibold transition-colors"
							>
								Clear all
							</button>
						)}
					</div>

					{/* Notifications List */}
					<div className="overflow-y-auto flex-1">
						{notifications.length === 0 ? (
							<div className="p-8 text-center text-gray-500">
								<Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
								<p className="text-sm">No notifications</p>
							</div>
						) : (
							<div className="divide-y divide-gray-100">
								{notifications.map((notification) => (
									<div
										key={notification.id}
										className={`p-4 border-l-4 ${getBgColor(notification.type)} hover:bg-opacity-80 transition-colors group`}
									>
										<div className="flex items-start gap-3">
											<div className="flex-shrink-0 mt-0.5">
												{getIcon(notification.type)}
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm text-gray-800 font-medium">
													{notification.message}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													{notification.timestamp.toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</p>
											</div>
											<button
												onClick={() => removeNotification(notification.id)}
												className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
											>
												<X className="w-4 h-4 text-gray-500" />
											</button>
										</div>
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

