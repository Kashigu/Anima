import connectToDatabase from '@/lib/db';
import UserModel from '@/lib/models/UserModel';
import CounterUserModel from '@/lib/models/CounterUserModel'; 
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { JWT } from '@/lib/interfaces/interface'; 
import express from 'express';
import multer from 'multer';
import path from 'path';

// Function to get the next user sequence
async function getNextSequence(name: string) {
  const counter = await CounterUserModel.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public/images')); // Change this to your public/images path
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const app = express();

app.use(express.json());

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const { authToken } = req.cookies;
    const { userId } = req.query;

    if (!authToken && !userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (userId) {
      try {
        const user = await UserModel.findOne({ id: userId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          image_url: user.image_url,
          description: user.description,
        });
      } catch (error) {
        console.error('Error fetching user by userId:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }

    if (authToken) {
      try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY || 'superhiperultrasecretkey') as JWT;
        const user = await UserModel.findOne({ id: decoded.id });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          image_url: user.image_url,
          description: user.description,
        });
      } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Not authenticated' });
      }
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
          description: '',
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
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            image_url: user.image_url,
            description: user.description,
          },
        });
      } catch (err) {
        console.error('Error during sign-in:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } else if (req.method === 'PUT') {
    const uploadHandler = upload.single('image_url');

    uploadHandler(req as any, res as any, async (err: any) => {
      if (err) {
        console.error('Error uploading image:', err);
        return res.status(500).json({ error: 'Failed to upload image' });
      }
      
      const { id, name, email, password, description } = req.body;
      const image_url = req.file
        ? `images/${req.file.filename}` // If a new file is uploaded, use its path
        : req.body.existing_image_url; // If no file is uploaded, use the existing image URL

      try {
        const updatedUser = await UserModel.findOneAndUpdate(
          { id: id },
          {
            name,
            email,
            description,
            ...(image_url && { image_url }), // Only add image_url if it exists
            password: password ? await bcrypt.hash(password, 10) : undefined,
          },
          { new: true } // Return the updated document
        );

        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(updatedUser); // Send back the updated user
      } catch (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
// Disable Next.js's default body parser for this API route
export const config = {
  api: {
    bodyParser: false,
  },
};