import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AuthorDashboard() {
  const [form, setForm] = useState({ title: '', description: '', genre: '' });
  const [cover, setCover] = useState(null);
  const [fictions, setFictions] = useState([]);

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

  useEffect(() => {
    fetch('/api/fictions')
      .then(res => res.json())
      .then(data => {
        if (userId) {
          setFictions(data.filter(f => f.authorId === userId));
        }
      });
  }, [userId]);

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('genre', form.genre);
    if (cover) data.append('cover', cover);
    await fetch('/api/fictions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });
    setForm({ title: '', description: '', genre: '' });
    setCover(null);
    alert('Fiction created!');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Create Fiction</h2>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Synopsis"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Genres (comma separated)"
          value={form.genre}
          onChange={e => setForm({ ...form, genre: e.target.value })}
        />
        <input type="file" onChange={e => setCover(e.target.files[0])} />
        <button type="submit">Create</button>
      </form>

      {fictions.length > 0 && (
        <div>
          <h3>Your Fictions</h3>
          <ul>
            {fictions.map(f => (
              <li key={f.id}>
                <Link to={`/fiction/${f.id}`}>{f.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
