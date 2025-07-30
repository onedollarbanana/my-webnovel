import React, { useEffect, useState, useContext } from 'react';
import { useParams, Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import ChapterView from './ChapterView';
import MarkdownEditor from './MarkdownEditor';

export default function FictionPage() {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [fiction, setFiction] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editing, setEditing] = useState(null);
  const [rating, setRating] = useState(null);
  const [myRating, setMyRating] = useState('1');
  const [followed, setFollowed] = useState(false);

  const userId = user ? user.id : null;

  const loadChapters = () => {
    fetch(`/api/chapters/${id}`)
      .then(res => res.json())
      .then(setChapters);
  };

  useEffect(() => {
    fetch(`/api/fictions/${id}`)
      .then(res => res.json())
      .then(setFiction);
    fetch(`/api/ratings/${id}`)
      .then(res => res.json())
      .then(r => setRating(r.average));
    loadChapters();
    if (token) {
      fetch('/api/follows', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setFollowed(data.some(f => f.id === Number(id))));
    }
  }, [id, token]);

  const handleSubmit = async e => {
    e.preventDefault();
    const opts = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    };
    const url = `/api/chapters/${id}/${editing.id}`;
    await fetch(url, opts);
    setForm({ title: '', content: '' });
    setEditing(null);
    loadChapters();
  };

  const submitRating = async e => {
    e.preventDefault();
    await fetch(`/api/ratings/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ value: Number(myRating) }),
    });
    const res = await fetch(`/api/ratings/${id}`);
    const data = await res.json();
    setRating(data.average);
  };

  const toggleFollow = async () => {
    if (!token) return;
    const method = followed ? 'DELETE' : 'POST';
    await fetch(`/api/follows/${id}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });
    setFollowed(!followed);
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
      <p>Average Rating: {rating ? rating.toFixed(1) : 'N/A'}</p>
      {userId && (
        <button onClick={toggleFollow}>{followed ? 'Unfollow' : 'Follow'}</button>
      )}
      {userId && (
        <form onSubmit={submitRating} className="rating-form">
          <select value={myRating} onChange={e => setMyRating(e.target.value)}>
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button type="submit">Rate</button>
        </form>
      )}
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
        <div style={{ marginBottom: '1rem' }}>
          <Link to="new-chapter">Add Chapter</Link>{' '}
          <Link to="edit">Edit Fiction</Link>
        </div>
      )}

      {userId === fiction.authorId && editing && (
        <form onSubmit={handleSubmit} className="chapter-form">
          <h4>Edit Chapter</h4>
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <MarkdownEditor
            value={form.content}
            onChange={value => setForm({ ...form, content: value })}
          />
          <small>Markdown formatting is supported. Use &gt; for stat block quotes.</small>
          <button type="submit">Update</button>
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
