import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import ProfilePage from '../components/ProfilePage';

global.fetch = jest.fn();
window.alert = jest.fn();

beforeEach(() => {
  fetch.mockReset();
  fetch
    .mockResolvedValueOnce({ json: () => Promise.resolve({ username: 'u', role: 'reader' }) })
    .mockResolvedValueOnce({ json: () => Promise.resolve([]) });
  localStorage.setItem('token', 't');
});

test('loads profile and submits update', async () => {
  render(<ProfilePage />);

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  await screen.findByPlaceholderText('Username');

  fetch.mockResolvedValueOnce({ json: () => Promise.resolve({}) });

  fireEvent.change(screen.getByPlaceholderText('Username'), {
    target: { value: 'new' },
  });
  fireEvent.submit(screen.getByText('Update').closest('form'));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
  expect(fetch.mock.calls[2][0]).toBe('/api/users/me');
  expect(fetch.mock.calls[2][1].method).toBe('PUT');
});
