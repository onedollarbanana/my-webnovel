import React, { useEffect, useState } from 'react';
import { useParams, Routes, Route, Link } from 'react-router-dom';
import ChapterView from './ChapterView';

export default function FictionPage() {
  const { id } = useParams();
  const [fiction, setFiction] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editing, setEditing] = useState(null);

  const userId = (() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  })();

  const loadChapters = () => {
    fetch(`/api/chapters/${id}`)
      .then(res => res.json())
      .then(setChapters);
  };

  useEffect(() => {
    fetch(`/api/fictions/${id}`)
      .then(res => res.json())
      .then(setFiction);
    loadChapters();
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const opts = {
      method: editing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    };
    const url = editing
      ? `/api/chapters/${id}/${editing.id}`
      : `/api/chapters/${id}`;
    await fetch(url, opts);
    setForm({ title: '', content: '' });
    setEditing(null);
    loadChapters();
  };

  const startEdit = chapter => {
    setEditing(chapter);
    setForm({ title: chapter.title, content: chapter.content || '' });
  };

  if (!fiction) return <div>Loading...</div>;

  return (
    <div>
      <h2>{fiction.title}</h2>
      <p>{fiction.description}</p>
      <h3>Chapters</h3>
      <ul className="chapter-list">
        {chapters.map(ch => (
          <li key={ch.id}>
            <Link to={`chapter/${ch.id}`}>{ch.title}</Link>
            {userId === fiction.authorId && (
              <button onClick={() => startEdit(ch)}>Edit</button>
            )}
          </li>
        ))}
      </ul>

      {userId === fiction.authorId && (
        <form onSubmit={handleSubmit} className="chapter-form">
          <h4>{editing ? 'Edit Chapter' : 'New Chapter'}</h4>
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
          />
          <button type="submit">{editing ? 'Update' : 'Create'}</button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ title: '', content: '' });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      <Routes>
        <Route path="chapter/:chapterId" element={<ChapterView />} />
      </Routes>
    </div>
  );
}
