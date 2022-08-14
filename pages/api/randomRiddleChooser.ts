import Redis from 'ioredis';
import type { NextApiRequest, NextApiResponse } from 'next'

let client = new Redis(process.env.REDIS_DB_URI as string);

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const keys = await client.keys('*')

    if(!keys) return res.status(200).json([]);

    const randomI = Math.floor(Math.random() * keys.length - 1)

    console.log(keys)
    console.log(randomI)
    console.log(keys[randomI])

    const answer = await client.get(keys[randomI]);

    if(!answer) return res.status(200).json([]);

    await client.set('riddleOfTheDay', keys[randomI]);

    await client.set('answerOfTheDay', answer);

    res.status(200).json('Done');
  } catch(error) {
    res.status(500).send(error);
  }
}
