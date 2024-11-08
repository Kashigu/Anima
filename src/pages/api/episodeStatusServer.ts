import connectToDatabase from "@/lib/db";
import CounterModel from "@/lib/models/CounterUserModel";
import EpisodeStatusModel from "@/lib/models/EpisodeStatusModel";

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


async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();

    if (req.method === 'GET') {
        const {userId, animeId} = req.query;
        try {
            if (userId && typeof userId === 'string') {
                const status = await EpisodeStatusModel.find({ idUser: userId });
                if (status) {
                    res.status(200).json(status);
                }
                else {
                    res.status(404).json({ error: 'Status not found' });
                }
                if (animeId && typeof animeId === 'string') {
                const status = await EpisodeStatusModel.find({ idAnime: animeId });
                res.status(200).json(status);
                }
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
