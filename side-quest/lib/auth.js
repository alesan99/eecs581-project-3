import { createHmac } from "crypto";
// Secret key for signing tokens; should be stored in environment variable
const SECRET = process.env.AUTH_SECRET || "missing-secret";

function base64url(input) {
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
