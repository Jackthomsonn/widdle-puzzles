import Redis from 'ioredis';
import type { NextApiRequest, NextApiResponse } from 'next'

let client = new Redis(process.env.REDIS_DB_URI as string);

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const riddle = await client.get('riddleOfTheDay');
  
  if(!riddle) return res.status(200).json([]);

  res.status(200).json({riddle})
}
