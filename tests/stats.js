const supertest = require("supertest");
const assert = require("assert");

const app = require("../server");

describe("Stats", function () {
	it("match schema ", function (done) {
		supertest(app)
			.get("/stats?api_key=key10&timeframe=14")
			.expect(200)
			.expect(function (res) {
				assert(res.body.hasOwnProperty("most_used_api_key"));
				assert(res.body.hasOwnProperty("max_activity"));
				assert(res.body.hasOwnProperty("total_requests_today_14hr"));
				assert(res.body.hasOwnProperty("avg_requests_7days_14hr"));
			})
			.end(done);
	});
});
