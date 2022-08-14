import Redis from 'ioredis';
import type { NextApiRequest, NextApiResponse } from 'next'
import { get } from 'fast-levenshtein';

let client = new Redis(process.env.REDIS_DB_URI as string);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { answer } = JSON.parse(req.body);

  const answerOfTheDay = await client.get('answerOfTheDay');

  if(!answerOfTheDay) return res.status(500).json('No answer');

  const distance = get(answer.toLowerCase(), answerOfTheDay.toLowerCase())

  if(distance <= 2) return res.status(200).json({correct: true, distance});

  return res.status(200).send({correct: false, distance});
}
