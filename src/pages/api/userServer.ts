import connectToDatabase from '@/lib/db';
import UserModel from '@/lib/models/UserModel';
import CounterUserModel from '@/lib/models/CounterUserModel'; // Import the CounterUserModel
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
    const { action, data } = req.body; // Destructure action and data

    if (action === 'signup') {
      try {
        const nextId = await getNextSequence('userId');
        const hashedPassword = await bcrypt.hash(data.password, 10); // Use data.password

        const newUser = await UserModel.create({
          id: nextId.toString(),
          name: data.name, // Use data.name
          email: data.email, // Use data.email
          password: hashedPassword,
          isAdmin: false,
          image_url: 'images/user.jpg'
        });

        return res.status(201).json(newUser);
      } catch (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } else if (action === 'signin') {
      // Handle login logic
      try {
        console.log('Incoming request body:', req.body);
        const { email, password } = data; // Use data.email and data.password
        console.log(data);

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign(
          { id: user.id, email: user.email, isAdmin: user.isAdmin },
          process.env.JWT_SECRET_KEY || 'superhiperultrasecretkey',
          { expiresIn: '1h' }
        );

        return res.status(200).json({ token });
      } catch (err) {
        console.error('Error during sign-in:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
