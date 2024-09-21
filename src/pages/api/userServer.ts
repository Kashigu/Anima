import connectToDatabase from '@/lib/db';
import UserModel from '@/lib/models/UserModel';
import CounterUserModel from '@/lib/models/CounterUserModel'; // Import the CounterModel
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';


// Function to get the next auto-increment id
async function getNextSequence(name: string) {
  const counter = await CounterUserModel.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const users = await UserModel.find({});
      return res.status(200).json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    try {
      const nextId = await getNextSequence('userId');

      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the salt rounds
      
      const newUser = await UserModel.create({
        id: nextId.toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword, // Store the hashed password
        isAdmin: false,
        image_url: 'images/user.jpg'
      });

      return res.status(201).json(newUser);
    } catch (err) {
      console.error('Error creating user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
