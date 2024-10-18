import connectToDatabase from '@/lib/db';
import CounterModel from '@/lib/models/CounterUserModel';
import EpisodeModel from '@/lib/models/EpisodeModel';
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

// Get the next anime ID from the counter
const getNextEpisodeId = async () => {
  const counter = await CounterModel.findByIdAndUpdate(
    { _id: 'episodeId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filePath = file.fieldname === 'video_url' ? 
      path.join(process.cwd(), 'public/videos') : 
      path.join(process.cwd(), 'public/images');
    
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500 MB for all files
  },
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const {id, search } = req.query;
    try {
      if (search && typeof search === 'string' && search.trim() !== '') {
        const episodes = await EpisodeModel.find({ title: { $regex: search, $options: 'i' } });
        res.status(200).json(episodes);
      } else if (id && typeof id === 'string') {
        const episode = await EpisodeModel.findOne({ id });
        if (episode) {
          res.status(200).json(episode);
        } else {
          res.status(404).json({ error: 'Episode not found' });
        }
      }else {
        const episodes = await EpisodeModel.find({});
        res.status(200).json(episodes);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    upload.fields([
      { name: 'thumbnail_url', maxCount: 1 }, // Specify maxCount if expecting one file
      { name: 'video_url', maxCount: 1 } // Specify maxCount if expecting one file
    ])(req as any, res as any, async (err: any) => {
      if (err) {
        console.error('Error uploading files:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    
      const { title, idAnime, episodeNumber } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const videoFile = files && files['video_url'] ? files['video_url'][0] : null;
      const thumbnailFile = files && files['thumbnail_url'] ? files['thumbnail_url'][0] : null;
    
      // Check for missing required fields
      if (!title || !idAnime || !episodeNumber || !videoFile || !thumbnailFile) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
    
      try {
        const id = await getNextEpisodeId();
        const episode = new EpisodeModel({
          id,
          title,
          idAnime,
          episodeNumber,
          video_url: `/videos/${videoFile.filename}`,
          thumbnail_url: `/images/${thumbnailFile.filename}` // Store filename for the thumbnail
        });
    
        await episode.save();
        res.status(201).json(episode);
      } catch (err) {
        console.error('Error creating episode:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
  } else if (req.method === 'PUT') {
    upload.fields([
      { name: 'thumbnail_url', maxCount: 1 }, // Specify maxCount if expecting one file
      { name: 'video_url', maxCount: 1 } // Specify maxCount if expecting one file
    ])(req as any, res as any, async (err: any) => {
      if (err) {
        console.error('Error uploading files:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    
      const { id, title, idAnime, episodeNumber } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const videoFile = files && files['video_url'] ? files['video_url'][0] : null;
      const thumbnailFile = files && files['thumbnail_url'] ? files['thumbnail_url'][0] : null;
    
      // Check for missing required fields
      if (!id || !title || !idAnime || !episodeNumber) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
    
      try {
        const episode = await EpisodeModel.findOne({ id });
        if (!episode) {
          return res.status(404).json({ error: 'Episode not found' });
        }
    
        episode.title = title;
        episode.idAnime = idAnime;
        episode.episodeNumber = episodeNumber;
        episode.video_url = videoFile ? `/videos/${videoFile.filename}` : episode.video_url;
        episode.thumbnail_url = thumbnailFile ? `/images/${thumbnailFile.filename}` : episode.thumbnail_url;
    
        await episode.save();
        res.status(200).json(episode);
      } catch (err) {
        console.error('Error updating episode:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }); 
  }else if (req.method === 'DELETE') {
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

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, because multer will handle it
  },
};