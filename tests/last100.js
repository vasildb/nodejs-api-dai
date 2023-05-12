const supertest = require("supertest");
const assert = require("assert");

const app = require("../server");

describe("Last 100", function () {
	describe("No api key", function () {
		it("should return status 403", function (done) {
			supertest(app).get("/").expect(403, done);
		});
	});

	describe("With api key", function () {
		it("should return array", function (done) {
			supertest(app)
				.get("/transactions/last100?api_key=key1000")
				.expect(function (res) {
					assert(Array.isArray(res.body));
				})
				.expect(200, done);
		});
	});
});
