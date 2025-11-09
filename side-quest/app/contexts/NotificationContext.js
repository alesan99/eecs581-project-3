/*
	Name: NotificationContext.js
	Description: Provides a React context for managing in-app notifications.
	Programmers: Pashia Vang
	Date: 11/06/2025
	Revisions: N/A
	Errors: N/A
	Input: Calls to addNotification, removeNotification
	Output: Notifications state available to components via context
*/

"use client";

import { createContext, useContext, useState, useCallback } from "react";

// Use context to allow other files to create notifications.
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
	const [notifications, setNotifications] = useState([]);

	// Function to add a notification. This can be imported in other files to trigger a notification.
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

	// Function to clear *specific* notification
	const removeNotification = useCallback((id) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	}, []);

	// Function to clear all notifications
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

// Allow other files to trigger and remove notifications with this.
export function useNotifications() {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error("useNotifications must be used within NotificationProvider");
	}
	return context;
}

