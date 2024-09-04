//animes.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb'; // Adjust the path if necessary

// Define the type for an Anime document
type Anime = {
  _id: string;
  name: string;
  description: string;
};

// Define the schema for the Anime model
const animeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});

// Create the Anime model if it doesn’t exist
const AnimeModel = mongoose.models.Anime || mongoose.model('Anime', animeSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse<Anime[] | { error: string }>) {
  try {
   
    await connectToDatabase();

    // Fetch all anime documents from the `animes` collection
    const animes = await AnimeModel.find({}).exec();

    res.status(200).json(animes);
  } catch (error) {
    // Log error and respond with a status code of 500 and an error message
    console.error('Error fetching animes:', error);
    res.status(500).json({ error: 'Failed to fetch animes' });
  }
}
