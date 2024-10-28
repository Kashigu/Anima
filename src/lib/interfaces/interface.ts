// src/lib/types/interfaces.ts
import mongoose from 'mongoose';

export interface Anime {
  _id: mongoose.Schema.Types.ObjectId;
  id: string;
  title: string;
  description: string;
  genres: Array<string>;
  image_url: string;
  big_image_url: string;
}

export interface Episode {
  _id: mongoose.Schema.Types.ObjectId;
  id: string;
  idAnime: string;
  title: string;
  video_url: string;
  episodeNumber: string;
  thumbnail_url: string;
}

export interface User {
  _id: mongoose.Schema.Types.ObjectId;
  id: string;
  name: string;
  email: string;
  password: string;
  image_url: string;
  isAdmin: boolean;
  description: string;
  isBlocked: boolean;
}

export interface Status {
  _id: mongoose.Schema.Types.ObjectId;
  id: string;
  idAnime: string;
  idUser: string;
  status: string;
}

export interface Category {
  _id: mongoose.Schema.Types.ObjectId;
  id: string;
  name: string;
}

export interface JWT{
  id: string;
  email: string;
  isAdmin: boolean;
}