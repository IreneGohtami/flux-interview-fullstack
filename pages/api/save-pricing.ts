import * as fs from 'fs';
import { z } from 'zod'

// This is the Zod validation schema, you define
// all the validation logic in here, then run
// the validation during the request lifecycle.
// If you prefer to use your own way of validating the 
// incoming data, you can use it.
const plan = z.object({
  lite: z.number({required_error: 'This is required'}),
  standard: z.number(),
  unlimited: z.number()
})
const Body = z.object({
  '36months': plan,
  '24months': plan,
  '12months': plan,
  'mtm': plan
})

export default async (req: import('next').NextApiRequest, res: import('next').NextApiResponse) => {
  try {
    // This will throw when the validation fails
    const data: any = Body.safeParse(JSON.parse(req.body))
    
    if (!data.success && data.error) { // Zod error
      const errCode = data.error.issues[0].code
      const errMsg = data.error.issues[0].message
      throw Error(`${errCode}: ${errMsg}`)
    }

    // Write the new matrix to public/pricing.json
    fs.writeFile('public/pricing.json', JSON.stringify(data.data), (err) => {
      if (err) {
        throw Error('Unable to save pricing. Please try again.')
      }
    })

    res.statusCode = 200
    res.json(data.data)
  } catch(e) {
    res.statusCode = 500
    res.json({ error: e.message || 'Unknown Error' })
  }
}