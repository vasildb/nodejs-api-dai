const supertest = require("supertest");

const app = require("../server");
const assert = require("assert");

describe("Throttling", function () {
	describe("Api key first time", function () {
		it("should return status 200", function (done) {
			supertest(app)
				.get("/transactions/last100?api_key=key1")
				.expect(function (res) {
					assert(Array.isArray(res.body));
				})
				.expect(200, done);
		});
	});

	describe("Api key second time time", function () {
		it("should return status 403", function (done) {
			supertest(app).get("/transactions/last100?api_key=key1").expect(403, "Access forbidden.", done);
		});
	});
});
