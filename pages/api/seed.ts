import Redis from 'ioredis';
import type { NextApiRequest, NextApiResponse } from 'next'

let client = new Redis(process.env.REDIS_DB_URI as string);

const riddles = [
  {
    r: "If apple made a car, what would be missing?",
    a: 'Windows'
  },
  {
    r: "What has lots of eyes, but can’t see?",
    a: 'A potato'
  },
  {
    r: 'What has one eye, but can’t see?',
    a: 'A needle'
  },
  {
    r: 'What can travel all around the world without leaving its corner?',
    a: 'A stamp'
  }
];

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    riddles.forEach(async (riddle) => {
      await client.set(riddle.r, riddle.a)
    });
    res.status(200).json('Done')
  } catch(error) {
    res.status(500).send(error);
  }
}