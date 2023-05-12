const express = require("express");
const { dbAll } = require("./../helpers/database");
const { numberReadable } = require("./../helpers/string");
const Web3 = require("web3");
const router = express.Router();

/*
	Returns the balance of :account
*/
router.get("/:account", (req, res) => {
	const account = req.params.account;
	dbAll("SELECT * FROM transactions WHERE src = ? OR dst = ?", [account, account])
		.then((rows) => {
			var BN = Web3.utils.BN;
			let sum = new BN("0");

			// Have to do this as SQL can't do big number math
			rows.forEach((r) => {
				if (r.src == account) sum = sum.sub(new BN(r.wad));
				else sum = sum.add(new BN(r.wad));
			});

			// BN doesn't support decimals, so, let's do this instead of including a library for it
			// https://github.com/indutny/bn.js/issues/213#issuecomment-475716946
			let readable = numberReadable(sum.toString(), 18);

			res.send({ balance: sum.toString(), formatted: readable });
		})
		.catch((e) => res.status(500).send(e));
});

module.exports = router;
