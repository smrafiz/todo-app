import { useState, useEffect } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from "next/link";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

type Todo = {
  id: number;
  title: string;
  datetime: string;
  is_done: number;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState(new Date().toISOString().slice(0, 16));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDatetime, setEditDatetime] = useState('');

  // Fetch todos on load
  useEffect(() => {
    fetch('/api/todos')
        .then(res => res.json())
        .then(data => setTodos(data));
  }, []);

  // Handle submit
  const handleAddTodo = async () => {
    if (!title || !datetime) return alert('Fill both fields');

    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, datetime }),
    });

    const newTodo = await res.json();
    setTodos(prev => [...prev, newTodo]);
    setTitle('');
    setDatetime('');
  };

  return (
      <div
          className={`${geistSans.className} ${geistMono.className} font-sans flex flex-col min-h-screen p-8 gap-8 bg-gray-50`}
      >
        <h1 className="text-2xl font-bold text-center">📝 My ToDo List</h1>
        <div className="mb-4 text-center">
          <Link href="/report" className="text-blue-600 underline">
              Go to report 
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
              className="border p-2 rounded w-full sm:w-1/3"
              placeholder="Enter todo title"
              value={title}
              onChange={e => setTitle(e.target.value)}
          />
          <input
              type="datetime-local"
              className="border p-2 rounded w-full sm:w-1/3"
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
          />
          <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleAddTodo}
          >
            Add
          </button>
        </div>

        <ul className="max-w-2xl mx-auto bg-white rounded shadow p-4 space-y-2">
          {todos.map(todo => {
            return (
                <li
                    key={todo.id}
                    className="flex justify-between items-center border-b pb-2"
                >
                  {editingId === todo.id ? (
                      <div className="flex flex-col gap-2">
                        <input
                            className="border p-1 rounded"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                        />
                        <input
                            type="datetime-local"
                            className="border p-1 rounded"
                            value={editDatetime}
                            onChange={e => setEditDatetime(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                              className="text-green-600 text-sm"
                              onClick={async () => {
                                const res = await fetch('/api/todos', {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    id: todo.id,
                                    title: editTitle,
                                    datetime: editDatetime,
                                  }),
                                });
                                const updated = await res.json();
                                setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
                                setEditingId(null);
                              }}
                          >
                            💾 Save
                          </button>
                          <button
                              className="text-gray-500 text-sm"
                              onClick={() => setEditingId(null)}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </div>
                  ) : (
                      <>
                        <div className="font-medium">{todo.title}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(todo.datetime).toLocaleString()}
                        </div>
                      </>
                  )}

                  <div className="flex gap-2 items-center">
                    {editingId !== todo.id &&
                        new Date(todo.datetime) >= new Date() && (
                            <button
                                className="text-sm text-indigo-500 hover:underline"
                                onClick={() => {
                                  setEditingId(todo.id);
                                  setEditTitle(todo.title);
                                  setEditDatetime(todo.datetime.slice(0, 16)); // Truncate for input
                                }}
                            >
                              ✏️ Edit
                            </button>
                        )}
                    {todo.is_done ? (
                        <span className="text-green-600 text-sm">✅ Done</span>
                    ) : (
                        <button
                            className="text-sm text-blue-600 hover:underline"
                            onClick={async () => {
                              const res = await fetch('/api/todos', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: todo.id, is_done: 1 }),
                              });
                              const updated = await res.json();
                              setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
                            }}
                        >
                          ✅ Mark as Done
                        </button>
                    )}

                    <button
                        className="text-sm text-red-500 hover:underline"
                        onClick={async () => {
                          await fetch('/api/todos', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: todo.id }),
                          });
                          setTodos(prev => prev.filter(t => t.id !== todo.id));
                        }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </li>
            );
          })}
        </ul>
      </div>
  );
}
