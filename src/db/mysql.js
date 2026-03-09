const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "27052004",
  database: "knowledge_base",
});

module.exports = pool;