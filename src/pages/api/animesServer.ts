import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/db';
import AnimeModel from '../../lib/models/AnimeModel';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      if (id && typeof id === 'string') {
        const anime = await AnimeModel.findOne({ id });
        if (anime) {
          res.status(200).json(anime);
        } else {
          res.status(404).json({ error: 'Anime not found' });
        }
      } else {
        const animes = await AnimeModel.find({});
        res.status(200).json(animes);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
