import connectToDatabase from '@/lib/db';
import UserModel from '@/lib/models/UserModel';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { JWT } from '@/lib/interfaces/interface'; 
import express from 'express';
import multer from 'multer';
import path from 'path';
import CounterModel from '@/lib/models/CounterUserModel';

// Function to get the next user sequence
async function getNextSequence(name: string) {
  const counter = await CounterModel.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public/images')); // Use the correct path to the public/images directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const app = express();

app.use(express.json()); // Use express JSON parser

const handlers = {
  GET: handleGet,
  POST: handlePost,
  PUT: handlePut,
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

export default handler;

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { authToken } = req.cookies;
  const { userId, fetchAll, search } = req.query;

  // If neither authToken nor userId is provided, return an authentication error
  if (!authToken && !userId) {
      return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
      // Case 1: If userId is provided, fetch the specific user's details
      if (userId) {
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
              isBlocked: user.isBlocked,
          });
      }

      // Case 2: If authToken is present but no userId, fetch all users
      if (authToken) {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY || 'superhiperultrasecretkey') as JWT;
    
        // Check if fetchAll is present and if the user is an admin
        if (fetchAll === 'true' && decoded.isAdmin) {
            const users = await UserModel.find({});
            return res.status(200).json(users);
        }
        else if (search && typeof search === 'string' && search.trim() !== ''){
          const users = await UserModel.find({ name: { $regex: search, $options: 'i' } });
          return res.status(200).json(users);
        }
    
        //Fetch only the authenticated user's data
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
            isBlocked: user.isBlocked,
        });
    }
  } catch (error) {
      console.error('Error handling request:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  let bodyData = '';

  // Manually parse the JSON body for POST requests
  req.on('data', (chunk) => {
    bodyData += chunk.toString(); // Accumulate data chunks
  });

  req.on('end', async () => {
    try {
      req.body = JSON.parse(bodyData); // Parse the accumulated data as JSON
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
            isBlocked: false
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
              isBlocked: user.isBlocked,
            },
          });
        } catch (err) {
          console.error('Error during sign-in:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      }
    } catch (err) {
      console.error('Error parsing request body:', err);
      return res.status(400).json({ error: 'Invalid request body' });
    }
  });
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  let DATA= '';

  // Manually parse the JSON body for POST requests
  req.on('data', (chunk) => {
    DATA += chunk.toString(); // Accumulate data chunks
  });

  req.on('end', async () => {
    try {
      req.body = JSON.parse(DATA); // Parse the accumulated data as JSON
      const { action, data } = req.body;
      const { userId, isBlocked } = data; // Extract userId and isBlocked from data

      if (action === 'block') {
          try {
              const user = await UserModel.findOne({ id: userId });
              if (!user) {
                  return res.status(404).json({ error: 'User not found' });
              }

              const updatedUser = await UserModel.findOneAndUpdate(
                  { id: userId },
                  { isBlocked: !isBlocked }, 
                  { new: true }
              );

              return res.status(200).json(updatedUser);
          } catch (err) {
              console.error('Error updating user status:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

      }else{


        app.use(express.json());
        const uploadHandler = upload.single('image_url');

        uploadHandler(req as any, res as any, async (err: any) => {
          if (err) {
            console.error('Error uploading image:', err);
            return res.status(500).json({ error: 'Failed to upload image' });
          }
          
          const { id, name, email, password, description } = req.body;
          const image_url = req.file ? `images/${req.file.filename}` : req.body.existing_image_url;

          try {
            const updatedUser = await UserModel.findOneAndUpdate(
              { id: id },
              {
                name,
                email,
                description,
                ...(image_url && { image_url }),
                password: password ? await bcrypt.hash(password, 10) : undefined,
              },
              { new: true }
            );

            if (!updatedUser) {
              return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json(updatedUser);
          } catch (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
        });
      }
    } catch (err) {
      console.error('Error parsing request body:', err);
      return res.status(400).json({ error: 'Invalid request body' });
    }
  });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  try {
    const deletedUser = await UserModel.deleteOne({ id: userId });
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(deletedUser);
  }
  catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ error: 'Internal Server'});
  }
}

// Disable Next.js's default body parser for this API route
export const config = {
  api: {
    bodyParser: false,
  },
};
