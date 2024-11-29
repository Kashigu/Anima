import connectToDatabase from "@/lib/db";
import CounterModel from "@/lib/models/CounterUserModel";
import StatusModel from "@/lib/models/StatusModel";
import { NextApiRequest, NextApiResponse } from "next";

// Function to get the next user sequence
async function getNextSequence(name: string) {
    const counter = await CounterModel.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
    );
    return counter.seq;
}

const handlers = {
    GET: handleGet,
    POST: handlePost,
    DELETE: handleDelete,
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
    const {userId, search, animeId, statusName} = req.query;
    try {
        if (userId && typeof userId === 'string' && !statusName) {
            const status = await StatusModel.find({ idUser: userId });
            if (status) {
            res.status(200).json(status);
            }
            else {
            res.status(404).json({ error: 'Status not found' });
            }
        } else if (search && typeof search === 'string' && search.trim() !== '') {
            const status = await StatusModel.find({ name: { $regex: search, $options: 'i' } });
            res.status(200).json(status);
        } else if (animeId && typeof animeId === 'string') {
            const status = await StatusModel.find({ idAnime: animeId });
            res.status(200).json(status);
        }else if (userId && typeof userId === 'string' && statusName && typeof statusName === 'string') {
            const status = await StatusModel.find({ idUser: userId, status: statusName });
            res.status(200).json(status);
        }else {
            const status = await StatusModel.find({});
            res.status(200).json(status);
        }
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const { userId, animeId, status } = req.body;
    try {
        const id = await getNextSequence('statusId');
        const newStatus = new StatusModel({
            id,
            idUser: userId,
            idAnime: animeId,
            status,
        });
        await newStatus.save();
        res.status(201).json(newStatus);
    } catch (err) {
        console.error('Error creating status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    try {
        if (id && typeof id === 'string') {
            const status = await StatusModel.findOneAndDelete
            ({ id: id });
            if (status) {
                res.status(200).json(status);
            }
        }
    } catch (err) {
        console.error('Error deleting status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default handler;