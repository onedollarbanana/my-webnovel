import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import FictionPage from '../components/FictionPage';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: '1' }),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  Routes: () => <div />,
  Route: () => null,
}));

const fetchMock = jest.fn();

global.fetch = fetchMock;

beforeEach(() => {
  fetchMock.mockReset();
  localStorage.setItem('token', 'x.eyJpZCI6MX0=.x');
  fetchMock
    .mockResolvedValueOnce({ json: () => Promise.resolve({ id: 1, title: 'Fic', description: 'd', authorId: 2 }) })
    .mockResolvedValueOnce({ json: () => Promise.resolve({ average: 0 }) })
    .mockResolvedValueOnce({ json: () => Promise.resolve([]) })
    .mockResolvedValueOnce({ json: () => Promise.resolve([]) });
});

test('follow button calls API', async () => {
  render(<FictionPage />);

  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(4));

  fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({}) });

  const btn = await screen.findByRole('button', { name: /follow/i });
  fireEvent.click(btn);

  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(5));
  expect(fetchMock.mock.calls[4][0]).toBe('/api/follows/1');
  expect(fetchMock.mock.calls[4][1].method).toBe('POST');
});
