import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function EditFictionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ title: '', description: '', genre: '' });

  useEffect(() => {
    fetch(`/api/fictions/${id}`)
      .then(res => res.json())
      .then(f => setForm({
        title: f.title || '',
        description: f.description || '',
        genre: f.genre || '',
      }));
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    await fetch(`/api/fictions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    navigate(`/fiction/${id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="dashboard-form">
      <h3>Edit Fiction</h3>
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
        placeholder="Genres"
        value={form.genre}
        onChange={e => setForm({ ...form, genre: e.target.value })}
      />
      <button type="submit">Save</button>
    </form>
  );
}
