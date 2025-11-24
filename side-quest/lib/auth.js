/*
	Name: auth.js
	Description: Supabase authentication implementation
	
	Programmers: Alejandro Sandoval, Liam Aga, Aiden Barnard
	Date: 10/26/2025
	Revisions: Built upon Liam's & Alejandro's comments 11/23/2025
	Errors: N/A
*/

import { createHmac } from "crypto";
// Secret key for signing tokens; MUST be set in environment for production.
// Falling back to a visible default here only prevents crashes in development
// but is insecure — replace with a real secret in deployment.
const SECRET = process.env.AUTH_SECRET || "missing-secret";

function base64url(input) {
	// Encode input as base64, then make it URL-safe by replacing characters
	// and removing padding. This is the common base64url encoding used in
	// JWT-like tokens so they can be transported in URLs and cookies.
	return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/*
	Function: signPayload
	Description: Signs a JSON payload to create a token.
	Arguments:
		payloadObj - object containing user data and optional expiry
	Returns: signed token string in format payload.signature
*/

export function signPayload(payloadObj) {
	const payload = base64url(JSON.stringify(payloadObj));
	// Create HMAC signature using SHA-256
	const sig = createHmac("sha256", SECRET).update(payload).digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
	return `${payload}.${sig}`;
}
/*
	Function: verifyToken
	Description: Verifies a signed token and optionally checks expiry.
	Arguments:
		token - string in format payload.signature
	Returns: decoded payload object if valid; null otherwise
*/
export function verifyToken(token) {
	try {
		// Split token into two parts: the payload (base64url) and its signature
		const [payloadB64, sig] = token.split(".");
		if (!payloadB64 || !sig) return null;

		// Recompute expected signature over the payload using the same secret
		// and HMAC algorithm. Compare in plain JS (fast); if needed consider
		// using a timed-constant comparison to avoid subtle timing attacks.
		const expected = createHmac("sha256", SECRET).update(payloadB64).digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
		if (expected !== sig) return null;

		// Decode payload and return it. Payload is trusted only after signature
		// verification above. The payload may optionally include an `exp` (ms)
		// field that we check here to enforce token expiry.
		const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString("utf8"));
		if (payload.exp && Date.now() > payload.exp) return null;
		return payload;
	} catch (e) {
		return null;
	}
}
