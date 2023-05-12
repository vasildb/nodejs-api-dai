const { numberReadable } = require("./../helpers/string");
const assert = require("assert");

describe("Test string functions", function () {
	it("numberReadable", function (done) {
		assert(numberReadable("0") === "0");
		assert(numberReadable("0.") === "0");
		assert(numberReadable("3430000000012313213") === "3.430000000012313213");
		assert(numberReadable("3430000000000000000") === "3.43");
		assert(numberReadable("124243534546546456") === "0.124243534546546456");
		done();
	});
});
