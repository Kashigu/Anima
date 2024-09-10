import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/db'; // Update this path if necessary
import AnimeModel from '../../lib/models/AnimeModel'; // Update this path if necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const animes = await AnimeModel.find({});
      res.status(200).json(animes);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch animes' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
