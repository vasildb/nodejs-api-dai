const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const DBNAME = "db.sqlite";

// Delete the old database
if (fs.existsSync(DBNAME)) {
	fs.unlink(DBNAME, function (err) {});
}

const db = new sqlite3.Database(DBNAME);

function dbSeed() {
	db.serialize(() => {
		db.run("CREATE TABLE transactions (blocknumber INTEGER, src TEXT, dst TEXT, wad TEXT)");
		db.run("CREATE TABLE api_keys (key TEXT, limit_per_minute INTEGER)");
		db.run("INSERT INTO api_keys VALUES('key10', 10), ('key1', 1), ('key1000', 1000)");
		db.run("CREATE TABLE logs (api_key TEXT, request TEXT, time INTEGER)");
	});
}

function dbGet(query, params = []) {
	return new Promise((resolve, reject) => {
		db.get(query, params, function (err, row) {
			if (err) reject(err);
			resolve(row);
		});
	});
}

function dbAll(query, params = []) {
	return new Promise((resolve, reject) => {
		db.all(query, params, function (err, row) {
			if (err) reject(err);
			resolve(row);
		});
	});
}

function dbRun(query, params = []) {
	return new Promise((resolve, reject) => {
		db.run(query, params, function (err, row) {
			if (err) reject(err);
			resolve(row);
		});
	});
}

dbSeed();

module.exports = { dbGet, dbAll, dbRun };
