import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Inclusive Fitness App title', () => {
  render(<App />);
  const linkElement = screen.getByText("Inclusive Fitness");
  expect(linkElement).toBeInTheDocument();
});
