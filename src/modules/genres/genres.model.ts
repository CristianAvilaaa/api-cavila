import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';

export interface Genre {
  _id?: ObjectId;
  name: string;
  description?: string;
}

const genreSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String }
});

export const GenreModel = model('Genre', genreSchema);