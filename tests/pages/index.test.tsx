import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { defaultPricing } from 'pages/api/pricing';
import Home from 'pages/index';

describe('Home', () => {
  it('renders the pricing table', () => {
    const { container } = render(<Home initialMatrix={defaultPricing} fallback={{}} />)

    const title = screen.getByText('Flux Pricing Table')
    const table = container.querySelector('#pricing-table')

    expect(title).toBeInTheDocument()
    expect(table).toBeInTheDocument()
  });
});