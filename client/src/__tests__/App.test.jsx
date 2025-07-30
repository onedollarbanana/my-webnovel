import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { AuthContext } from '../AuthContext';

const wrapper = ({ children }) => (
  <AuthContext.Provider value={{ user: null, logout: jest.fn() }}>
    {children}
  </AuthContext.Provider>
);

test('renders home page', () => {
  render(<App />, { wrapper });
  expect(screen.getByText(/welcome to my-webnovel/i)).toBeDefined();
});
