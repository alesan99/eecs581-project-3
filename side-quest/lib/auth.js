/*
	Name: auth.js
	Description: Utility functions for user authentication.
	Programmers: Alejandro Sandoval
	Date: 10/25/2025
	Revisions: N/A
	Errors: N/A
*/

import { createHmac } from "crypto";

const SECRET = process.env.AUTH_SECRET || "missing-secret";

function base64url(input) {
	return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function signPayload(payloadObj) {
	const payload = base64url(JSON.stringify(payloadObj));
	const sig = createHmac("sha256", SECRET).update(payload).digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
	return `${payload}.${sig}`;
}

export function verifyToken(token) {
	try {
		const [payloadB64, sig] = token.split(".");
		if (!payloadB64 || !sig) return null;
		const expected = createHmac("sha256", SECRET).update(payloadB64).digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
		if (expected !== sig) return null;
		const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString("utf8"));
		// optional expiry check
		if (payload.exp && Date.now() > payload.exp) return null;
		return payload;
	} catch (e) {
		return null;
	}
}