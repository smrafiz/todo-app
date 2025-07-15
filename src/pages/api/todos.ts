import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const todos = db.prepare('SELECT * FROM todos ORDER BY datetime ASC').all();
		return res.status(200).json(todos);
	}

	if (req.method === 'POST') {
		const { title, datetime } = req.body;
		if (!title || !datetime) return res.status(400).json({ error: 'Missing data' });

		const stmt = db.prepare('INSERT INTO todos (title, datetime) VALUES (?, ?)');
		const result = stmt.run(title, datetime);
		const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
		return res.status(201).json(todo);
	}

	if (req.method === 'PUT') {
		const { id, is_done, title, datetime } = req.body;
		if (!id) return res.status(400).json({ error: 'Missing ID' });

		if (typeof is_done !== 'undefined') {
			db.prepare('UPDATE todos SET is_done = 1 WHERE id = ?').run(id);
		} else if (title && datetime) {
			db.prepare('UPDATE todos SET title = ?, datetime = ? WHERE id = ?').run(title, datetime, id);
		} else {
			return res.status(400).json({ error: 'Missing fields for edit' });
		}

		const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
		return res.status(200).json(updated);
	}

	if (req.method === 'DELETE') {
		const { id } = req.body;
		if (!id) return res.status(400).json({ error: 'Missing ID' });

		db.prepare('DELETE FROM todos WHERE id = ?').run(id);
		return res.status(204).end();
	}

	return res.status(405).json({ error: 'Method not allowed' });
}
