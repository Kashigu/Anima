import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/db'; // Adjust the path as needed
import EpisodeModel from '../../../lib/models/EpisodeModel'; // Adjust the path as needed

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const { id } = req.query; // Extract the dynamic parameter

    try {
      if (id && typeof id === 'string') {
        // Fetch episodes based on the provided id
        const episodes = await EpisodeModel.find({ idAnime: id });
        res.status(200).json(episodes);
      } else {
        res.status(400).json({ error: 'Invalid ID' });
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
