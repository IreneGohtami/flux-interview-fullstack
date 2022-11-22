import '@testing-library/jest-dom'
import { createMocks } from 'node-mocks-http'
import { defaultPricing } from 'pages/api/pricing'
import savePricing from 'pages/api/save-pricing'

describe('/api/save-pricing', () => {
  it('saves the pricing data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/save-pricing',
      //@ts-ignore
      body: JSON.stringify(defaultPricing)
    });
  
    await savePricing(req, res)
  
    const { data } = res._getJSONData()
    expect(data).toEqual(defaultPricing)
    expect(res._getStatusCode()).toBe(200)
  });

  it('throws validation error', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/save-pricing',
      //@ts-ignore
      body: JSON.stringify({})
    });
  
    await savePricing(req, res)

    const { error } = res._getJSONData()
    expect(error).toBe('36months Required, 24months Required, 12months Required, mtm Required')
    expect(res._getStatusCode()).toBe(500)
  });
});