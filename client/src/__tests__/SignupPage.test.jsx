import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import SignupPage from '../components/SignupPage';

global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve({ token: '123' }) })
);

window.alert = jest.fn();

test('submits signup form', async () => {
  render(<SignupPage />);
  fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'u' } });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'p' } });
  fireEvent.submit(screen.getByRole('button', { name: /signup/i }).closest('form'));

  await waitFor(() => expect(fetch).toHaveBeenCalled());
  const call = fetch.mock.calls[0];
  expect(call[0]).toBe('/api/auth/signup');
  expect(call[1].method).toBe('POST');
});
