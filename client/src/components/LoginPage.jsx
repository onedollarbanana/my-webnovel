import React, { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '', role: 'reader' });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      alert('Logged in!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>
      <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
        <option value="reader">Reader</option>
        <option value="author">Author</option>
      </select>
      <button type="submit">Login</button>
    </form>
  );
}
