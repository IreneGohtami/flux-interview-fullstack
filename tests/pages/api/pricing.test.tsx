import '@testing-library/jest-dom'
import { createMocks } from 'node-mocks-http'
import getPricing from 'pages/api/pricing'

describe('/api/pricing', () => {
  it('returns the pricing data', () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/pricing',
    })
  
    getPricing(req, res)
  
    expect(res._getStatusCode()).toBe(200)

    const data = res._getJSONData()
    expect(data).toHaveProperty('36months')
    expect(data).toHaveProperty('24months')
    expect(data).toHaveProperty('12months')
    expect(data).toHaveProperty('mtm')
  });
});