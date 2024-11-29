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

const getBackCategoryId = async () => {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: 'categoryId' },
      { $inc: { seq: -1 } },
      { new: true, upsert: true }
    );
    return counter.seq;
  };

const handlers = {
    GET: handleGet,
    POST: handlePost,
    PUT: handlePut,
    DELETE: handleDelete
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();
    const methodHandler = handlers[req.method as keyof typeof handlers];

    if (methodHandler) {
        try {
          return await methodHandler(req, res);
        } catch (err) {
          console.error('Error handling request:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      } else {
        res.setHeader('Allow', Object.keys(handlers));
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
}


async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const {id, search} = req.query;
       try {
        if (id && typeof id === 'string') {
            const category = await CategoryModel.findOne({ id });
            if (category) {
            res.status(200).json(category);
            }
            else {
            res.status(404).json({ error: 'Category not found' });
            }
        } else if (search && typeof search === 'string' && search.trim() !== '') {
            const categories = await CategoryModel.find({ name: { $regex: search, $options: 'i' } });
            res.status(200).json(categories);
        }
        else {
            const categories = await CategoryModel.find({});
            res.status(200).json(categories);
        }
        } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { name } = req.body;
        const id = await getNextCategoryId();
        const newCategory = new CategoryModel({ id, name });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) {
        console.error('Error creating category:', err);
        await getBackCategoryId();
        res.status(500).json({ error: 'Internal Server Error' });
    }    
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id, name } = req.body;
        const category = await CategoryModel.findOne({ id: id });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        await CategoryModel.findOneAndUpdate({ id: id }, { name: name });
        await AnimeModel.updateMany(
            { genres: category.name },
            { $set: { 'genres.$': name } }
        );
        res.status(200).json({ message: 'Category updated successfully' });
        } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
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
}

export default handler;