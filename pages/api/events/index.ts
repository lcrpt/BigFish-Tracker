import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb';
import { appConfig } from '@/utils/appConfig';


export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise
      const db = client.db(process.env.MONGO_DBNAME)

      const {
        skip = 0,
        limit = 10,
        range = appConfig.defaultThreshold
      } = req.query;

      if (!limit || !skip || !range) {
        res.status(400).json({ message: 'Bad Request, missing parameters' });
        return;
      }

      const query = {};
      const preventMaxLimit: number = Number(limit) > 50 ? 50 : Number(limit);

      if (req.query.address) {
        Object.assign(query, { $or: [{ from: req.query.address }, { to: req.query.address }] });
      }

      if (req.query.range) {
        Object.assign(query, { amount: { $gte: Number(req.query.range) } });
      }

      const result = await db.collection('events')
        .find(query)
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(preventMaxLimit)
        .toArray();

      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: 'Bad Request' });
    }
  } else {
    res.status(400).json({ message: 'Bad Request' });
  }
}
