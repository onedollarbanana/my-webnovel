import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function ProfilePage() {
  const { user: currentUser, token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', password: '' });
  const [follows, setFollows] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setForm(f => ({ ...f, username: data.username }));
      });
    fetch('/api/follows', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setFollows);
  }, [token]);

  const handleSubmit = async e => {
    e.preventDefault();
    await fetch('/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    alert('Profile updated');
  };

  if (!currentUser) return <div>Please login</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      {follows.length > 0 && (
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
      <form onSubmit={handleSubmit} className="profile-form">
        <h3>Update Info</h3>
        <input
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="New Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
