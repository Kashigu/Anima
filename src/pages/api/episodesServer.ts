import connectToDatabase from '@/lib/db';
import EpisodeModel from '@/lib/models/EpisodeModel';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      // Fetch all episodes
      const episodes = await EpisodeModel.find({});
      res.status(200).json(episodes);
    } catch (err) {
      console.error('Error fetching episodes:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
