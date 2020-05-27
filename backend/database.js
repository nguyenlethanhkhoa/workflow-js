var mysql = require("mysql");
var database = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "workflow",
});

database.connect();
module.exports = database;
