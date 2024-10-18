import connectToDatabase from '@/lib/db';
import EpisodeModel from '@/lib/models/EpisodeModel';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const { search } = req.query;
    try {
      if (search && typeof search === 'string' && search.trim() !== '') {
        const episodes = await EpisodeModel.find({ title: { $regex: search, $options: 'i' } });
        res.status(200).json(episodes);
      } else {
        const episodes = await EpisodeModel.find({});
        res.status(200).json(episodes);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      if (id && typeof id === 'string') {
        const episode = await EpisodeModel.findOneAndDelete({ id: id });

        if (!episode) {
          return res.status(404).json({ error: 'Episode not found' });
        }
        return res.status(200).json({ message: 'Episode successfully deleted', episode });
      } else {
        return res.status(400).json({ error: 'Invalid ID' });
      }
    } catch (err) {
      console.error('Error deleting episode:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } 
  }else {
    res.setHeader('Allow', ['GET','DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
