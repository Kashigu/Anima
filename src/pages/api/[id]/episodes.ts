import connectToDatabase from '@/lib/db';
import EpisodeModel from '@/lib/models/EpisodeModel';
import { NextApiRequest, NextApiResponse } from 'next';



async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const { id, episodeId, search } = req.query;

    try {
      if (id && typeof id === 'string') {
        if (episodeId && typeof episodeId === 'string') {
          // Fetch a specific episode by animeId and episodeId
          const episode = await EpisodeModel.findOne({ idAnime: id, id: episodeId });
          if (episode) {
            res.status(200).json(episode);
          } else{
            res.status(404).json({ error: 'Episode not found' });
          }
        }else if( search && typeof search === 'string' && search.trim() !== ''){
          const episode = await EpisodeModel.find({ idAnime: id, title: { $regex: search, $options: 'i' } });
          if (episode) {
            res.status(200).json(episode);
          }else{
            res.status(404).json({ error: 'Episode not found' });
          }
        }else {
          // Fetch all episodes for a given animeId
          const episodes = await EpisodeModel.find({ idAnime: id });
          res.status(200).json(episodes);
        }
      } else {
        res.status(400).json({ error: 'Invalid or missing animeId' });
      }
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
