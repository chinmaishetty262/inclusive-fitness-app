import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders Inclusive Fitness App title', async () => {
    render(<App />);

    const titleElement = await screen.findByText(/inclusive fitness/i);

    expect(titleElement).toBeInTheDocument();
  });
});