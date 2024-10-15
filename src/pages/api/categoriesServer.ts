import connectToDatabase from '@/lib/db';
import AnimeModel from '@/lib/models/AnimeModel';
import CategoryModel from '@/lib/models/CategoriesModel';
import { NextApiRequest, NextApiResponse } from 'next';


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