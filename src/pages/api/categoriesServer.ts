import connectToDatabase from '@/lib/db';
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
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;