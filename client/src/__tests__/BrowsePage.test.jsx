import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import BrowsePage from '../components/BrowsePage';

global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }));

test('updates filters and calls API', async () => {
  render(<BrowsePage />);
  global.fetch.mockClear();

  fireEvent.change(screen.getByPlaceholderText(/Search/), { target: { value: 'foo' } });
  fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'popular' } });

  await waitFor(() => expect(fetch).toHaveBeenCalled());
  const lastCall = fetch.mock.calls[fetch.mock.calls.length - 1][0];
  expect(lastCall).toContain('search=foo');
  expect(lastCall).toContain('sort=popular');
});
