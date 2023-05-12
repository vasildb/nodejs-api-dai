const { dbGet, dbRun } = require("./database");

/*
	Checks if the api key exists
	If exists, checks if it reached its limit
*/
async function checkApiKey(key) {
	const api_key = await getApiKey(key);
	if (api_key) {
		return await checkApiKeyLimits(api_key);
	}
	return false;
}

/*
	Saves the request in logs table
	This is called even in unauthorized requests
 */
async function logRequest(req) {
	const key = req.query.api_key || "";
	const request = req.method + " " + req.originalUrl;
	const time = new Date().getTime();
	await dbRun("INSERT INTO logs VALUES(?,?,?)", [key, request, time]);
}

// Checks if the api key has reached the maximum requests per minute
async function checkApiKeyLimits(api_key) {
	const timeThreshold = new Date().getTime() - 60 * 1000;
	const row = await dbGet("SELECT COUNT(*) as count FROM logs WHERE api_key = ? AND time > ?", [api_key.key, timeThreshold]);
	return !(row.count > api_key.limit_per_minute);
}

// Gets the api key from database
async function getApiKey(key) {
	const row = await dbGet("SELECT * FROM api_keys WHERE key = ?", [key]);
	return row;
}

module.exports = { checkApiKey, logRequest };
