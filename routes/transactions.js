const express = require("express");
const { dbAll } = require("./../helpers/database");
const router = express.Router();

/*
	Returns the last 100 transactions in descending order
	10 results per page, max page is 10
*/
router.get("/last100", (req, res) => {
	let page = parseInt(req.query.page, 10) || 1;
	if (page > 10) page = 10;
	if (page < 1) page = 1;
	const offset = (page - 1) * 10;
	dbAll("SELECT * FROM transactions ORDER BY rowid DESC LIMIT 10 OFFSET ?", [offset])
		.then((rows) => {
			res.send(rows);
		})
		.catch((e) => res.status(500).send(e));
});

/*
	Returns all transactions in descending order
	where sender is :sender
*/
router.get("/sender/:sender", (req, res) => {
	const sender = req.params.sender;
	dbAll("SELECT * FROM transactions WHERE src = ? ORDER BY rowid DESC", [sender])
		.then((rows) => {
			res.send(rows);
		})
		.catch((e) => res.status(500).send(e));
});

/*
	Returns all transactions in descending order
	where recipient is :recipient
*/
router.get("/recipient/:recipient", (req, res) => {
	const recipient = req.params.recipient;
	dbAll("SELECT * FROM transactions WHERE dst = ? ORDER BY rowid DESC", [recipient])
		.then((rows) => {
			res.send(rows);
		})
		.catch((e) => res.status(500).send(e));
});

module.exports = router;
