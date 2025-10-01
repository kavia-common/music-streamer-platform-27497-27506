import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app shell and sidebar brand', () => {
  render(<App />);
  // The Sidebar brand text
  const brand = screen.getByText(/Music Streamer/i);
  expect(brand).toBeInTheDocument();

  // TopBar subtitle
  const subtitle = screen.getByText(/Ocean Professional/i);
  expect(subtitle).toBeInTheDocument();
});
