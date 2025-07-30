import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import ChapterView from '../components/ChapterView';
import { AuthContext } from '../AuthContext';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: '1', chapterId: '1' })
}));

const fetchMock = jest.fn();

global.fetch = fetchMock;

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock
    .mockResolvedValueOnce({ json: () => Promise.resolve({ id: 1, title: 'ch', content: 'txt' }) })
    .mockResolvedValueOnce({ json: () => Promise.resolve([]) });
});

test('loads chapter and posts comment', async () => {
  const wrapper = ({ children }) => (
    <AuthContext.Provider value={{ token: 't' }}>{children}</AuthContext.Provider>
  );
  render(<ChapterView />, { wrapper });

  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

  fetchMock
    .mockResolvedValueOnce({ json: () => Promise.resolve({}) })
    .mockResolvedValueOnce({ json: () => Promise.resolve([{ id: 1, content: 'hi' }]) });

  const input = await screen.findByRole('textbox');
  fireEvent.change(input, { target: { value: 'hi' } });
  fireEvent.submit(screen.getByText('Comment').closest('form'));

  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(4));
  expect(fetchMock.mock.calls[2][0]).toContain('/api/comments/1');
  expect(fetchMock.mock.calls[2][1].method).toBe('POST');
});
