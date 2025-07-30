import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <h2>Welcome to My-Webnovel</h2>
      <p>
        My-Webnovel is an open platform where anyone can publish and share their
        stories. Create an account to start writing your own fiction or browse
        works from other authors.
      </p>
      <p>
        Looking for something new to read? Visit the{' '}
        <Link to="/browse">Browse</Link> page to explore by genre or popularity.
      </p>
    </div>
  );
}
