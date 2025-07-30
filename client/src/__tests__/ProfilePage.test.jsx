import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import ProfilePage from '../components/ProfilePage';

global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve({ username: 'u', role: 'reader' }) })
);
window.alert = jest.fn();

beforeEach(() => {
  global.fetch.mockClear();
  localStorage.setItem('token', 't');
});

test('loads profile and submits update', async () => {
  render(<ProfilePage />);

  await waitFor(() => expect(fetch).toHaveBeenCalled());
  await screen.findByPlaceholderText('Username');

  fetch.mockResolvedValueOnce({ json: () => Promise.resolve({}) });

  fireEvent.change(screen.getByPlaceholderText('Username'), {
    target: { value: 'new' },
  });
  fireEvent.submit(screen.getByText('Update').closest('form'));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  expect(fetch.mock.calls[1][0]).toBe('/api/users/me');
  expect(fetch.mock.calls[1][1].method).toBe('PUT');
});
