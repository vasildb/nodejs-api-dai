const supertest = require("supertest");
const assert = require("assert");

const app = require("../server");

describe("Account", function () {
	describe("No api key", function () {
		it("should return status 403", function (done) {
			supertest(app).get("/account/0xTEST").expect(403, done);
		});
	});

	describe("With api key", function () {
		it("should return balance", function (done) {
			supertest(app)
				.get("/balance/0xtest?api_key=key1000")
				.expect(function (res) {
					assert(res.body, { balance: "0", formatted: "0" });
				})
				.expect(200, done);
		});
	});
});
