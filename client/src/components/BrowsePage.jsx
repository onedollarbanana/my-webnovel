import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BrowsePage() {
  const [fictions, setFictions] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('latest');
  const [genres, setGenres] = useState([]);
  const [ratings, setRatings] = useState({});

  const fetchFictions = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (genre) params.append('genre', genre);
    if (sort) params.append('sort', sort);
    fetch(`/api/fictions?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setFictions(data);
        setGenres([...new Set(data.map(f => f.genre).filter(Boolean))]);
        data.forEach(f => {
          fetch(`/api/ratings/${f.id}`)
            .then(res => res.json())
            .then(r =>
              setRatings(prev => ({ ...prev, [f.id]: r.average }))
            );
        });
      });
  };

  useEffect(() => {
    fetchFictions();
  }, [search, genre, sort]);

  return (
    <div>
      <h2>Browse</h2>
      <div>
        <input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={genre} onChange={e => setGenre(e.target.value)}>
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="latest">Latest Update</option>
          <option value="popular">Popularity</option>
        </select>
      </div>
      <div className="cards-container">
        {fictions.map(f => (
          <div key={f.id} className="card">
            {f.coverImage && (
              <img src={f.coverImage} alt={f.title} width="100" />
            )}
          <h3>
            <Link to={`/fiction/${f.id}`}>{f.title}</Link>
          </h3>
          <p>{f.genre}</p>
          <p>Rating: {ratings[f.id] ? ratings[f.id].toFixed(1) : 'N/A'}</p>
        </div>
      ))}
      </div>
    </div>
  );
}
