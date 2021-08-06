import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import '../Translation';

import Application from './';

test('renders back button', () => {
  const { getByText } = render(<Application />);
  expect(getByText('Back')).toBeInTheDocument();
});
