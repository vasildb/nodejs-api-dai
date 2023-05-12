const express = require("express");
const { dbGet } = require("./../helpers/database");
const router = express.Router();

/*
	Stats SQL queries
*/
router.get("/", (req, res) => {
	// timeframe is 0 - 23
	// example: if timeframe is 4, we query results between 4:00 and 4:59
	let timeframe = req.query.timeframe || 0;
	if (timeframe < 0 || timeframe > 23) timeframe = 0;

	const api_key = req.query.api_key;

	Promise.all([
		// most used api key
		dbGet("SELECT api_key, COUNT(*) as amount FROM logs GROUP BY api_key ORDER BY amount DESC LIMIT 1"),
		// sum of all requests in specific timeframe
		dbGet("SELECT COUNT(*) AS count  FROM logs WHERE STRFTIME('%Y-%m-%d %H', DATETIME(time/1000, 'unixepoch', 'localtime')) = DATE('now') || ' ' || ?", [timeframe]),
		// avg number of requests per specific timeframe, for the last 7 days
		dbGet(
			"SELECT cast(COUNT(*) as real)/7 AS count, DATETIME(time/1000, 'unixepoch', 'localtime') AS thedate \
            FROM logs WHERE STRFTIME('%H', thedate)=? and thedate > date('now', '-7 days')",
			[timeframe]
		),
		// 3 hour time period for specific api key (uses the current one), when the usage is the highest
		dbGet(
			"SELECT hour AS hour, SUM(count) OVER (ORDER BY hour ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING) amount \
            FROM (WITH RECURSIVE hours(hour) AS (SELECT 0 UNION ALL SELECT hour + 1 FROM hours WHERE hour < 25) \
            SELECT CASE WHEN hour = 24 THEN 0 WHEN hour = 25 THEN 1 ELSE hour END AS hour, \
            CAST(STRFTIME('%H', DATETIME(logs.time / 1000, 'unixepoch', 'localtime')) as integer) AS thedate, \
            COUNT(request) as count FROM hours LEFT JOIN logs ON hours.hour = thedate AND api_key=? \
            GROUP BY hours.hour) \
            ORDER BY amount DESC, hour ASC LIMIT 1",
			[api_key]
		),
	])
		.then((values) => {
			let obj = { most_used_api_key: { ...values[0] }, max_activity: { ...values[3] } };

			obj["total_requests_today_" + timeframe + "hr"] = values[1].count;

			obj["avg_requests_7days_" + timeframe + "hr"] = values[2].count;

			res.send(obj);
		})
		.catch((e) => res.status(500).send(e));
});

module.exports = router;
