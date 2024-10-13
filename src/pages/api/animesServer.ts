import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/db';
import AnimeModel from '../../lib/models/AnimeModel';
import EpisodeModel from '@/lib/models/EpisodeModel';
import CounterModel from '@/lib/models/CounterUserModel';
import multer from 'multer';
import path from 'path';

// Get the next anime ID from the counter
const getNextAnimeId = async () => {
  const counter = await CounterModel.findByIdAndUpdate(
    { _id: 'animesId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public/images')); // Correct path to public/images directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

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
  } else if (req.method === 'POST') {
    upload.fields([
      { name: 'image_url', maxCount: 1 }, // Specify maxCount if expecting one file
      { name: 'big_image_url', maxCount: 1 } // Specify maxCount if expecting one file
  ])(req as any, res as any, async (err: any) => {
      if (err) {
          console.error('Error uploading images:', err);
          return res.status(500).json({ error: 'Failed to upload images' });
      }

      const { title, description } = req.body;
      
      // Access uploaded files
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const imageFile = files && files['image_url'] ? files['image_url'][0] : null;
      const bigImageFile = files && files['big_image_url'] ? files['big_image_url'][0] : null;

      const image_url = imageFile ? `/images/${imageFile.filename}` : req.body.existing_image_url;
      const big_image_url = bigImageFile ? `/images/${bigImageFile.filename}` : req.body.existing_big_image_url;

      // Parse the genres array from req.body
      const genres = req.body.genres || []; // This might be a single string if not handled properly
      const genreArray = Array.isArray(genres) ? genres : [genres]; // Ensure it is an array 

      try {
          const id = await getNextAnimeId();
          if (id && title && description && image_url) {
              const anime = await AnimeModel.create({ id, title, description, genres: genreArray, image_url, big_image_url });
              return res.status(201).json(anime);
          } else {
              return res.status(400).json({ error: 'Invalid data' });
          }
      } catch (err) {
          console.error('Error creating data:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      if (id && typeof id === 'string') {
        const anime = await AnimeModel.findOneAndDelete({ id });
        if (!anime) {
          return res.status(404).json({ error: 'Anime not found' });
        }
        await EpisodeModel.deleteMany({ idAnime: id });
        return res.status(200).json({ message: 'Anime and related episodes successfully deleted', anime });
      } else {
        return res.status(400).json({ error: 'Invalid ID' });
      }
    } catch (err) {
      console.error('Error deleting data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

// Disable Next.js's default body parser for this API route
export const config = {
  api: {
    bodyParser: false,
  },
};