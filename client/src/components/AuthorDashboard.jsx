import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function AuthorDashboard() {
  const [form, setForm] = useState({ title: '', description: '', genre: '' });
  const [cover, setCover] = useState(null);
  const [fictions, setFictions] = useState([]);
  const [follows, setFollows] = useState([]);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    fetch('/api/fictions')
      .then(res => res.json())
      .then(data => {
        if (user) {
          setFictions(data.filter(f => f.authorId === user.id));
        }
      });
    if (token) {
      fetch('/api/follows', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(setFollows);
    }
  }, [user, token]);

  const handleSubmit = async e => {
    e.preventDefault();
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
      {user && (
        <form onSubmit={handleSubmit} className="dashboard-form">
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
      )}

      {user && fictions.length > 0 && (
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
      {token && follows.length > 0 && (
        <div>
          <h3>Followed Fictions</h3>
          <ul>
            {follows.map(f => (
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
