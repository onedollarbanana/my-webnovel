import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import MarkdownEditor from './MarkdownEditor';

export default function AddChapterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ title: '', content: '' });

  const handleSubmit = async e => {
    e.preventDefault();
    await fetch(`/api/chapters/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    navigate(`/fiction/${id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="chapter-form">
      <h3>New Chapter</h3>
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
      <button type="submit">Create</button>
    </form>
  );
}
