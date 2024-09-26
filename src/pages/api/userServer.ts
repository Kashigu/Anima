import connectToDatabase from '@/lib/db';
import UserModel from '@/lib/models/UserModel';
import CounterUserModel from '@/lib/models/CounterUserModel'; 
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { JWT } from '@/lib/interfaces/interface'; // Make sure to import your JWT interface

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
    const { authToken } = req.cookies; // Extract the token from cookies

    if (!authToken) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY || 'superhiperultrasecretkey') as JWT;

      // Fetch user from the database
      const user = await UserModel.findOne({ id: decoded.id });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        image_url: user.image_url,
      });
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ error: 'Not authenticated' });
    }
  } else if (req.method === 'POST') {
    const { action, data } = req.body;

    if (action === 'signup') {
      try {
        const nextId = await getNextSequence('userId');
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await UserModel.create({
          id: nextId.toString(),
          name: data.name,
          email: data.email,
          password: hashedPassword,
          isAdmin: false,
          image_url: 'images/whiteuser.png',
        });

        return res.status(201).json(newUser);
      } catch (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } else if (action === 'signin') {
      try {
        const { email, password } = data;
        const user = await UserModel.findOne({ email });
        if (!user) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, isAdmin: user.isAdmin },
          process.env.JWT_SECRET_KEY || 'superhiperultrasecretkey',
          { expiresIn: '1h' }
        );

        res.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60,
          path: '/',
        }));

        return res.status(200).json({
          token,
          user: {
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            image_url: user.image_url,
          },
        });
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
