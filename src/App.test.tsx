import React from 'react';

import { render, screen } from '@testing-library/react';

import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

const identifiers = [
  { system: 'system1', value: 'value1' },
  { system: 'system2', value: 'value2' }
];

test.each(identifiers)(
  'renders learn react link {system}-{value}',
  (system, value) => {
    console.log(system);
    console.log(value);
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  }
);
