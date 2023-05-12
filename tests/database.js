const { dbGet, dbAll, dbRun } = require("../helpers/database");
const assert = require("assert");

describe("Test database", function () {
	it("Should return a number", function () {
		return dbGet("SELECT COUNT(*) AS count FROM logs").then((res) => {
			assert(res.count >= 0);
		});
	});

	it("Should return three rows", function () {
		return dbAll("SELECT * FROM api_keys").then((res) => {
			assert(res.length === 3);
		});
	});

	it("Should insert into transactions", function () {
		return dbRun("INSERT INTO transactions VALUES(?,?,?,?)", [1, "from", "to", "0001"]).then(async (res) => {
			let count = (
				await dbGet(
					"SELECT COUNT(*) as count FROM transactions \
					WHERE blocknumber = 1 \
					AND src = 'from' \
					AND dst = 'to' \
					AND wad = '0001'"
				)
			).count;
			assert(count === 1);
		});
	});
});
