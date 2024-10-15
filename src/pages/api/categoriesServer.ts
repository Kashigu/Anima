import connectToDatabase from '@/lib/db';
import AnimeModel from '@/lib/models/AnimeModel';
import CategoryModel from '@/lib/models/CategoriesModel';
import CounterModel from '@/lib/models/CounterUserModel';
import { NextApiRequest, NextApiResponse } from 'next';

// Get the next anime ID from the counter
const getNextCategoryId = async () => {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: 'categoryId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return counter.seq;
  };


async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();
    
    if (req.method === 'GET') {
        try {
        // Fetch all categories
        const categories = await CategoryModel.find({});
        res.status(200).json(categories);
        } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    }else if (req.method === 'POST') {
        try {
        const { name } = req.body;
        const id = await getNextCategoryId();
        const newCategory = new CategoryModel({ id, name });
        await newCategory.save();
        res.status(201).json(newCategory);
        } catch (err) {
        console.error('Error creating category:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        }    
    }else if (req.method === 'DELETE') {
        try {
        const { id } = req.query;
        const genre = await CategoryModel.findOne({ id: id });

        if (!genre) {
            return res.status(404).json({ error: 'Genre not found' });
        }

        const genreName = genre.name;
        await CategoryModel.findOneAndDelete({ id: id });
        await AnimeModel.updateMany(
            { genres: genreName },
            { $pull: { genres: genreName } }
        );
        res.status(200).json({ message: 'Category deleted successfully' });
        } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    }else {
        res.setHeader('Allow', ['GET','DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;