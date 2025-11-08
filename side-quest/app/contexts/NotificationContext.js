"use client";

import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
	const [notifications, setNotifications] = useState([]);

	const addNotification = useCallback((notification) => {
		const id = Date.now() + Math.random();
		const newNotification = {
			id,
			message: notification.message,
			type: notification.type || "info", // 'success', 'info', 'warning', 'error'
			timestamp: new Date(),
			lifetime: (notification.lifetime || 5)*1000, // How long the notification lasts in seconds.
		};

		setNotifications((prev) => [newNotification, ...prev]);

		// Auto-remove notification after 5 seconds
		setTimeout(() => {
			setNotifications((prev) => prev.filter((n) => n.id !== id));
		}, newNotification.lifetime);

		return id;
	}, []);

	const removeNotification = useCallback((id) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	}, []);

	const clearAll = useCallback(() => {
		setNotifications([]);
	}, []);

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				addNotification,
				removeNotification,
				clearAll,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
}

export function useNotifications() {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error("useNotifications must be used within NotificationProvider");
	}
	return context;
}

