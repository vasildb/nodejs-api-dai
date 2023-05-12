const supertest = require("supertest");

const app = require("../server");

describe("Homepage", function () {
	describe("No api key", function () {
		it("should return status 403", function (done) {
			supertest(app).get("/").expect(403, done);
		});
	});

	describe("With api key", function () {
		it("should return status 404", function (done) {
			supertest(app).get("/?api_key=key1000").expect(404, done);
		});
	});
});
