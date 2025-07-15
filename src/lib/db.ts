import Database from 'better-sqlite3';

const db = new Database('todos.db');

// Create the table if it doesn't exist
db.exec(`
	CREATE TABLE IF NOT EXISTS todos (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		datetime TEXT NOT NULL,
		is_done INTEGER DEFAULT 0
	)
`);

export default db;
