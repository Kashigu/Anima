import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/db';
import AnimeModel from '../../lib/models/AnimeModel';
import EpisodeModel from '@/lib/models/EpisodeModel';

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
  }else if(req.method === 'DELETE') {
    const { id } = req.query;
    try {
      if (id && typeof id === 'string') {
        const anime = await AnimeModel.findOneAndDelete({ id: id });
        
        if (!anime) {
          return res.status(404).json({ error: 'Anime not found' });
        }
        await EpisodeModel.deleteMany({ idAnime: id });
        return res.status(200).json({ message: 'Anime and related episodes successfully deleted', anime });
      }else {
        return res.status(400).json({ error: 'Invalid ID' });
      }
    }
    catch (err) {
      console.error('Error deleting data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  
  }else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
