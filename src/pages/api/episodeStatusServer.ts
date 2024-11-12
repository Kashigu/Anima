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
                const episodeStatus = await EpisodeStatusModel.find({ idUser: userId });
                if (episodeStatus) {
                    res.status(200).json(episodeStatus);
                }
                else {
                    res.status(404).json({ error: 'EpisodeStatus not found' });
                }
                if (animeId && typeof animeId === 'string') {
                const episodeStatus = await EpisodeStatusModel.find({ idAnime: animeId });
                res.status(200).json(episodeStatus);
                }
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }else if (req.method === 'POST') {
        const { userId, animeId, episodes } = req.body;
        
        try {
            const id = await getNextSequence('episodeStatusId');
            const newEpisodeStatus = new EpisodeStatusModel({
                id,
                idUser: userId,
                idAnime: animeId,
                episodes,
            });
            await newEpisodeStatus.save();
            res.status(201).json(newEpisodeStatus);
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }else if (req.method === 'DELETE') {
        const { id } = req.query;
        try {
            const episodeStatus = await EpisodeStatusModel.findOneAndDelete
            ({ id: id });
            if (episodeStatus) {
                res.status(200).json(episodeStatus);
            }
            else {
                res.status(404).json({ error: 'EpisodeStatus not found' });
            }
        }
        catch (err) {
            console.error('Error deleting data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

export default handler;
