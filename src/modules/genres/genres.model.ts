import { ObjectId } from 'mongodb';

export interface Genre {
  _id?: ObjectId;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGenreDTO {
  name: string;
  description?: string;
}

export interface UpdateGenreDTO {
  name?: string;
  description?: string;
}