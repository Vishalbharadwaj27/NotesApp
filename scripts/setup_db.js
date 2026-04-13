const mysql = require("mysql2/promise");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || process.env.password || "root",
};

const databaseName = process.env.DB_NAME || "knowledge_base";

async function setup() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL.");

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    console.log(`Database \`${databaseName}\` initialized.`);

    await connection.query(`USE \`${databaseName}\``);

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createUsersTable);

    const createNotesTable = `
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        priority ENUM('HIGH', 'MEDIUM', 'LOW') DEFAULT 'LOW',
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await connection.query(createNotesTable);

    const createTagsTable = `
      CREATE TABLE IF NOT EXISTS tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      )
    `;
    await connection.query(createTagsTable);

    console.log("Database and tables are ready!");
  } catch (error) {
    console.error("Setup failed:", error.message);
  } finally {
    if (connection) await connection.end();
  }
}

setup();
