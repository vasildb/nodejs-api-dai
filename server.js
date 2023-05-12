const express = require("express");
const { checkApiKey, logRequest } = require("./helpers/access");
const { sync } = require("./sync");

const transactions = require("./routes/transactions");
const balance = require("./routes/balance");
const stats = require("./routes/stats");

const app = express();

sync();

/*
	Middleware to check api key
    And log requests
*/
app.use(async (req, res, next) => {
	const key = req.query.api_key;

	try {
		// nothing depends on logRequest, so make it non blocking
		logRequest(req).catch((e) => res.status(500).send(e));
		if (await checkApiKey(key)) next();
		else res.status(403).send("Access forbidden.");
	} catch (e) {
		res.status(500).send(e);
	}
});

app.use("/transactions", transactions);
app.use("/balance", balance);
app.use("/stats", stats);

module.exports = app;
