import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/db';
import AnimeModel from '../../lib/models/AnimeModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      console.log('Request received for GET /api/animes');
      const animes = await AnimeModel.find({});
      console.log('Fetched animes:', animes);
      res.status(200).json(animes);
    } catch (err) {
      console.error('Error fetching animes:', err);
      res.status(500).json({ error: 'Failed to fetch animes' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
